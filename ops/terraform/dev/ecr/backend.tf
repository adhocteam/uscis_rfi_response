terraform {
  backend "s3" {
    bucket         = "uscis-tf-state"
    key            = "dev/ecr/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "uscis-tf-table"
    encrypt        = "1"
  }
}
