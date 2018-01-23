#!/bin/bash

set -eu

REPO="uscis-backend"
REGION="us-east-1"
FULLREPO="***REMOVED***.dkr.ecr.us-east-1.amazonaws.com/$REPO"
ENV=${1}
TAG=${2:-latest}

# Login to ECR
$(aws ecr get-login --no-include-email --region=$REGION)

# Tag the freshly build image with ECR repo
docker tag $REPO:$ENV-$TAG $FULLREPO:$ENV-$TAG
docker tag $REPO:$ENV-$TAG $FULLREPO:$ENV-latest

# Push the ECR tagged image to ECR repo
docker push $FULLREPO:$ENV-$TAG
docker push $FULLREPO:$ENV-latest
