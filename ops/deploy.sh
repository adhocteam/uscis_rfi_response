#!/bin/bash

set -e

ENV=$1
VERSION=$2

usage() {
  echo "./deploy.sh ENV VERSION"
  exit 1
}

if [ -z "$ENV" ] || [ -z "$VERSION" ]
then
  usage
fi

pushd terraform/$ENV/backend
terraform init && terraform apply -var service_version=$VERSION
popd
