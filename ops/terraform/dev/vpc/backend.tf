terraform {
  backend "s3" {
    bucket         = "uscis-tf-state"
    key            = "dev/vpc/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "uscis-tf-table"

    # TODO(rnagle): encrypt with KMS
    #encrypt        = "1"
    #kms_key_id     = ""
  }
}
