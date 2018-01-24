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
pushd ../config && ./fetch.sh $ENV && popd

pushd ../../backend

# Copy the env file from ops/config
cp ../ops/config/$ENV/env .env

ls -al

cat .env

# Add CMD directive to the Dockerfile
CMD="CMD /bin/bash -c 'source .env && bundle exec unicorn -c config/unicorn.rb'"
echo "$(cat Dockerfile)"$'\n'"$CMD" > Dockerfile.$ENV

# Build an image for the specified env
docker build -f Dockerfile.$ENV -t uscis-backend:$ENV-$TAG .

# Clean up
rm Dockerfile.$ENV
rm .env

popd
