provider "aws" {
  region = "us-east-1"
}

module "uscis_vpc" {
  source = "../../modules/vpc"
  vpc_name = "uscis-vpc"
}
