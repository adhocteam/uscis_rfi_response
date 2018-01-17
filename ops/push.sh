#!/bin/bash

set -e

if [[ ! -z "$1" ]]
then
  REPO="$1"
else
  echo "Must provide a image/repo name"
  exit 1
fi

REGION="us-east-1"
FULLREPO="968246069280.dkr.ecr.us-east-1.amazonaws.com/$REPO"
TAG=${2:-latest}

# Login to ECR
$(aws ecr get-login --no-include-email --region=$REGION)

# Tag the freshly build image with ECR repo
docker tag $REPO:$TAG $FULLREPO:$TAG

# Push the ECR tagged image to ECR repo
docker push $FULLREPO:$TAG
