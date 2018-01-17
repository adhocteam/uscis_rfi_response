provider "aws" {
  region = "${var.aws_region}"
}

variable "name" {
  default = "uscis-backend"
}

module "registry" {
  source = "../modules/ecr"

  repository_name = "${var.name}"
}

module "application" {
  source = "../modules/app"

  # TODO: lock this down
  admin_cidr_ingress = "0.0.0.0/0"

  # TODO: allow setting a different key
  key_name           = "ecs"

  container_name     = "${var.name}"
  ecr_img_url        = "${module.registry.repository_url}"
}
