#!/bin/bash

set -e

BUCKET=$1

usage() {
  echo "./frontend-deploy.sh BUCKET"
  exit 1
}

if [ -z "$BUCKET" ]
then
  usage
fi

pushd ../../frontend
yarn install && yarn build
aws s3 sync build/ s3://$BUCKET
