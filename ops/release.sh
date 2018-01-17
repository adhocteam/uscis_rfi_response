#!/bin/bash

set -e

VERSION=${1}

if [ -z "$VERSION" ]
then
  echo "Must specify a version"
  exit 1
fi

./build.sh uscis-backend $VERSION
./push.sh uscis-backend $VERSION
