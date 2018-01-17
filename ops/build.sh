#!/bin/bash

set -e

cd ../backend

if [[ -f tmp/pids/server.pid ]]
then
  echo "Cancel running instances of the app before building"
  exit 1
fi

if [[ "$1" != "" ]]
then
  docker build -t uscis-backend:${1} .
else
  docker build -t uscis-backend .
fi

