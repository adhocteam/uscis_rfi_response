#!/bin/bash

set -eu

AWS_ACCOUNT_ID="$1"

if [ -z "$AWS_ACCOUNT_ID" ]
then
  echo "An AWS account ID is required."
  exit 1
fi

REPO="uscis-backend"
REGION="us-east-1"
FULLREPO="${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/$REPO"
ENV=${2}
TAG=${3:-latest}

# Login to ECR
$(aws ecr get-login --no-include-email --region=$REGION)

# Tag the freshly build image with ECR repo
docker tag $REPO:$ENV-$TAG $FULLREPO:$ENV-$TAG
docker tag $REPO:$ENV-$TAG $FULLREPO:$ENV-latest

# Push the ECR tagged image to ECR repo
docker push $FULLREPO:$ENV-$TAG
docker push $FULLREPO:$ENV-latest
