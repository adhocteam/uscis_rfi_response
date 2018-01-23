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
  VERSION=$(git rev-parse --short=12 HEAD)
fi

./build.sh $ENV $VERSION
./push.sh $ENV $VERSION
