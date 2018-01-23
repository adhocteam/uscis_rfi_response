#!/bin/bash

set -euxo pipefail

export TF_CLI_ARGS="-no-color"
export TF_VAR_db_password="$DB_PASS"
export AWS_DEFAULT_REGION="us-east-1"

TARGET_GROUP="tf-ecs-uscis-backend"
TARGET_GROUP_ARN=$(aws elbv2 describe-target-groups \
  --names "$TARGET_GROUP" \
  --query "TargetGroups[0].{arn: TargetGroupArn}" \
  --output text)

# Does an image with this version tag already exist?
IMG_CHECK=$(aws ecr list-images \
  --repository-name uscis-backend \
  --query "imageIds[].{tag: imageTag}" \
  --output text | grep "dev-$VERSION")

if [ -z "$IMG_CHECK" ]
then
  echo "No image exists for the specified version"
  exit 1
fi

# Verify terraform is only changing the appropriate resources
pushd ops/terraform/dev/backend
TF_OUT=$(terraform plan \
  -var service_version=$VERSION \
  -var db_password=$DB_PASS)

set +e
TF_SRVC_CHECK=$(echo "$TF_OUT" | grep "module.uscis_backend.aws_ecs_service.main")
TF_TASK_CHECK=$(echo "$TF_OUT" | grep "module.uscis_backend.aws_ecs_task_definition.app_task_def")
TF_PLAN_CHECK=$(echo "$TF_OUT" | grep "Plan: 1 to add, 1 to change, 1 to destroy.")
set -e

if [ -z "$TF_SRVC_CHECK" ] || [ -z "$TF_TASK_CHECK" ] || [ -z "$TF_PLAN_CHECK" ]
then
  echo "Terraform plan does not match expectations for a deploy."
  exit 1
fi

popd

# Run the deploy
pushd ops/scripts
./backend-deploy.sh dev $VERSION true

# Stash the desired task count
DESIRED_TASKS=$(aws ecs describe-services --cluster terraform-uscis-backend-ecs-cluster \
    --services tf-ecs-uscis-backend \
    --query "services[?serviceName=='tf-ecs-uscis-backend'].{d: desiredCount}" \
    --output text)

# Verify the deployment's health
TIMEOUT=600
ELAPSED=0
SLEEP_SECONDS=60

while true
do
  if [ "$ELAPSED" == "$TIMEOUT" ]
  then
    echo "Timeout waiting for healthy containers"
    exit 1
  fi

  sleep "${SLEEP_SECONDS}s"

  RESULT=$(aws elbv2 describe-target-health \
    --target-group-arn "$TARGET_GROUP_ARN" \
    --query "TargetHealthDescriptions[*].{health: TargetHealth}" \
    --output text)

  set +e
  HEALTH_CHECK=$(echo "$RESULT" | grep -E "unhealthy|initial|draining|unused")
  set -e

  RUNNING_TASKS=$(aws ecs describe-services --cluster terraform-uscis-backend-ecs-cluster \
    --services tf-ecs-uscis-backend \
    --query "services[?serviceName=='tf-ecs-uscis-backend'].{r: runningCount}" \
    --output text)

  if [ -z "$HEALTH_CHECK" ] && [ "$RUNNING_TASKS" == "$DESIRED_TASKS" ]
  then
    exit 0
  fi

  ELAPSED=$(($ELAPSED + $SLEEP_SECONDS))
done