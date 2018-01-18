#!/bin/bash

set -eu

ENV=$1
BUCKET="uscis-backend-config-vars"
KMS_KEY="alias/uscis_backend"

aws s3 cp \
  --sse-kms-key-id "$KMS_KEY" \
  --sse "aws:kms" \
  $ENV/env s3://$BUCKET/$ENV/env
