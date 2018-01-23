#!/bin/bash

set -eu

if [[ -f tmp/pids/server.pid ]]
then
  echo "Cancel running instances of the app before building"
  exit 1
fi

ENV=${1}
TAG=${2:-latest}

# Pull config vars from s3 before build
pushd ../config
./fetch.sh $ENV
popd

pushd ../../backend

# Produce a Dockerfile.$ENV file with env vars embedded
vars=$'\n'"# Environment variables"$'\n'
for v in $(cat ../ops/config/$ENV/env);
do
  vars="${vars}ENV $v"$'\n'
done

echo "$(cat Dockerfile)"$'\n'"$vars" > Dockerfile.$ENV

# Build an image for the specified env
docker build -f Dockerfile.$ENV -t uscis-backend:$ENV-$TAG .

# Clean up
rm Dockerfile.$ENV

popd
