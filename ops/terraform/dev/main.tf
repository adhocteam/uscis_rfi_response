provider "aws" {
  region = "${var.aws_region}"
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

  # TODO: lock this down
  admin_cidr_ingress = "0.0.0.0/0"

  # TODO: allow setting a different key
  key_name           = "ecs"

  container_name     = "uscis-backend"
  ecr_img_url        = "${module.uscis_backend_registry.repository_url}"
}
