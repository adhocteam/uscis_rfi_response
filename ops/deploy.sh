#!/bin/bash

set -e

ENV=$1
VERSION=$2

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

pushd terraform/$ENV/backend
terraform init && terraform apply -auto-approve -var service_version=$VERSION
popd
