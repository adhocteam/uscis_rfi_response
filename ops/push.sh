#!/bin/bash

set -e

REPO="uscis-backend"
REGION="us-east-1"
FULLREPO="***REMOVED***.dkr.ecr.us-east-1.amazonaws.com/$REPO"
TAG=${1:-latest}

# Login to ECR
$(aws ecr get-login --no-include-email --region=$REGION)

# Tag the freshly build image with ECR repo
docker tag $REPO:$TAG $FULLREPO:$TAG
docker tag $REPO:$TAG $FULLREPO:latest

# Push the ECR tagged image to ECR repo
docker push $FULLREPO:$TAG
docker push $FULLREPO:latest
