#!/bin/bash

set -e

VERSION=${1}

if [ -z "$VERSION" ]
then
  VERSION=$(git rev-parse --short=12 HEAD)
fi

./build.sh $VERSION
./push.sh $VERSION
