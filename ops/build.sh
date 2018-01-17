#!/bin/bash

set -e

cd ../backend

if [[ -f tmp/pids/server.pid ]]
then
  echo "Cancel running instances of the app before building"
  exit 1
fi

TAG=${1:-latest}

docker build -t uscis-backend:$TAG .
