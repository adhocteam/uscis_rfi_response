provider "aws" {
  region = "us-east-1"
}

module "uscis_backend_registry" {
  source = "../../modules/ecr"

  repository_name = "uscis-backend"
}
