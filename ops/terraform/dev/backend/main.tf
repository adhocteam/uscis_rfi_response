provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "uscis_vpc" {
  id = "uscis-vpc"
}

data "aws_subent_ids" "uscis_subnet_ids" {
  vpc_id = "uscis-vpc"
  tags {
    Name = "ecs-uscis-vpc"
  }
}

#
# Backend
#
module "uscis_backend_registry" {
  source = "../modules/ecr"

  repository_name = "uscis-backend"
}

module "uscis_backend" {
  source = "../modules/app"

  # TODO(rnagle): lock this down
  admin_cidr_ingress = "0.0.0.0/0"

  # TODO(rnagle): allow setting a different key
  key_name           = "ecs"

  container_name     = "uscis-backend"
  ecr_img_url        = "${module.uscis_backend_registry.repository_url}"

  vpc_id = "${data.aws_vpc.uscis_vpc.vpc_id}"
  subnet_ids = ["${data.aws_subnet_ids.uscis_subnet_ids.ids}"]
}
