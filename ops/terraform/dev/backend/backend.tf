terraform {
  backend "s3" {
    bucket         = "uscis-tf-state"
    key            = "dev/backend/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "uscis-tf-table"
    encrypt        = "1"
    kms_key_id     = "arn:aws:kms:us-east-1:968246069280:key/176febca-5a61-4a48-9bb9-79cc4e6d8216"
  }
}
