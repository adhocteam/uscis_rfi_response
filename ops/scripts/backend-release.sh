#!/bin/bash

set -e

ENV=$1
VERSION=$2

usage() {
  echo "./backend-release.sh ENV VERSION"
  exit 1
}

if [ -z "$ENV" ]
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
./backend-push.sh $ENV $VERSION
