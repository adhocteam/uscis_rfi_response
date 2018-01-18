#!/bin/bash

set -eu

ENV=$1
BUCKET="uscis-backend-config-vars"
KMS_KEY="alias/uscis_backend"

if [ ! -d "$ENV" ]
then
  mkdir -p $ENV
fi

aws s3 cp \
  s3://$BUCKET/$ENV/env $ENV/env
