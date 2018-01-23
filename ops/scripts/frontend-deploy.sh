#!/bin/bash

set -e

BUCKET=$3

usage() {
  echo "./frontend-deploy.sh BUCKET"
  exit 1
}

if [ -z "$BUCKET" ]
then
  usage
fi

pushd frontend
yarn build
aws s3 sync build/ s3://$BUCKET
