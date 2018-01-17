provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "uscis_vpc" {
  tags {
    Name = "ecs-uscis-vpc"
  }
}

data "aws_subnet_ids" "uscis_subnet_ids" {
  vpc_id = "${data.aws_vpc.uscis_vpc.id}"
  tags {
    Name = "ecs-uscis-vpc"
  }
}

data "aws_ecr_repository" "uscis_backend" {
  name = "uscis-backend"
}

#
# Backend
#
module "uscis_backend" {
  source = "../../modules/app"

  # TODO(rnagle): lock this down
  admin_cidr_ingress = "0.0.0.0/0"

  # TODO(rnagle): allow setting a different key
  key_name           = "ecs"

  container_name     = "uscis-backend"
  ecr_img_url        = "${data.aws_ecr_repository.uscis_backend.repository_url}"

  vpc_id = "${data.aws_vpc.uscis_vpc.id}"
  subnet_ids = ["${data.aws_subnet_ids.uscis_subnet_ids.ids}"]

  service_version    = "${var.service_version}"
}
