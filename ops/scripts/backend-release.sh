#!/bin/bash

set -e

AWS_ACCOUNT_ID=$1
ENV=$2
VERSION=$3

usage() {
  echo "./backend-release.sh AWS_ACCOUNT_ID ENV VERSION"
  exit 1
}

if [ -z "$ENV" ] || [ -z "$AWS_ACCOUNT_ID" ]
then
  usage
fi

if [ -z "$VERSION" ]
then
  VERSION=$(git rev-parse --short=12 origin/master)
fi

if [ ${#VERSION} -gt 12 ]
then
  VERSION="${VERSION:0:12}"
fi

./backend-build.sh $ENV $VERSION
./backend-push.sh $AWS_ACCOUNT_ID $ENV $VERSION
