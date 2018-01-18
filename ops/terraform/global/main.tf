# Create the resources used to track terraform state.
# These are not tracked in terraform state and so
# only a single `terraform apply`
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "state_bucket" {
  bucket = "uscis-tf-state"
  acl    = "private"
}

resource "aws_dynamodb_table" "state_table" {
  name           = "uscis-tf-table"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
