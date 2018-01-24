terraform {
  backend "s3" {
    bucket         = "uscis-tf-state"
    key            = "global/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "uscis-tf-table"
    encrypt        = "1"
    kms_key_id     = "arn:aws:kms:us-east-1:***REMOVED***:key/***REMOVED***"
  }
}
