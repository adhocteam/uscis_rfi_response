#!/bin/bash

set -e

ENV=$1
VERSION=$2
FORCE=$3

usage() {
  echo "./deploy.sh ENV VERSION"
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

if [ ! -z "$FORCE" ]
then
  FORCE="-auto-approve"
fi

pushd terraform/$ENV/backend
terraform init && terraform apply -var service_version=$VERSION $FORCE
popd
