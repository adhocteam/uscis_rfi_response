#!/bin/bash

set -e

if [[ -f tmp/pids/server.pid ]]
then
  echo "Cancel running instances of the app before building"
  exit 1
fi

if [[ ! -z "$1" ]]
then
  IMAGE="$1"
else
  echo "Must provide a image name"
  exit 1
fi

cd ../backend

TAG=${2:-latest}

docker build -t $IMAGE:$TAG .
