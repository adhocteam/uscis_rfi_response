provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "uscis_vpc" {
  tags {
    Name = "ecs-uscis-vpc"
  }
}

data "aws_subnet_ids" "uscis_dmz_subnet_ids" {
  vpc_id = "${data.aws_vpc.uscis_vpc.id}"

  tags {
    Name = "ecs-uscis-vpc-dmz"
  }
}

data "aws_subnet_ids" "uscis_app_subnet_ids" {
  vpc_id = "${data.aws_vpc.uscis_vpc.id}"

  tags {
    Name = "ecs-uscis-vpc-app"
  }
}

data "aws_subnet_ids" "uscis_data_subnet_ids" {
  vpc_id = "${data.aws_vpc.uscis_vpc.id}"

  tags {
    Name = "ecs-uscis-vpc-data"
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

  env = "dev"

  # TODO(rnagle): lock this down
  admin_cidr_ingress = "0.0.0.0/0"

  # TODO(rnagle): allow setting a different key
  key_name = "ecs"

  container_name = "uscis-backend"
  ecr_img_url    = "${data.aws_ecr_repository.uscis_backend.repository_url}"

  vpc_id         = "${data.aws_vpc.uscis_vpc.id}"
  dmz_subnet_ids = ["${data.aws_subnet_ids.uscis_dmz_subnet_ids.ids}"]
  app_subnet_ids = ["${data.aws_subnet_ids.uscis_app_subnet_ids.ids}"]

  service_version = "${var.service_version}"
  task_count      = 2
  asg_desired     = 1
  ami_id          = "ami-28456852"
}

resource "aws_db_subnet_group" "backend" {
  name_prefix = "tf-uscis-backend-"
  subnet_ids  = ["${data.aws_subnet_ids.uscis_data_subnet_ids.ids}"]

  tags {
    Name = "uscis-backend-db-subnet-group"
  }
}

resource "aws_security_group" "db_sg" {
  description = "controls direct access to application rds instances"
  vpc_id      = "${data.aws_vpc.uscis_vpc.id}"
  name        = "ecs-uscis-backend-db-sg"

  ingress {
    protocol  = "tcp"
    from_port = 5432
    to_port   = 5432

    security_groups = [
      "${module.uscis_backend.instance_security_group}"
    ]
  }

  tags {
    Name = "ecs-uscis-backend-db-sg"
  }
}

resource "aws_db_instance" "backend" {
  identifier_prefix      = "tf-uscis-backend-"
  allocated_storage      = 10
  storage_type           = "gp2"
  engine                 = "postgres"
  engine_version         = "9.6.5"
  instance_class         = "db.t2.micro"
  name                   = "uscis_backend"
  username               = "uscis"
  password               = "${var.db_password}"
  db_subnet_group_name   = "${aws_db_subnet_group.backend.name}"
  vpc_security_group_ids = ["${aws_security_group.db_sg.id}"]
  skip_final_snapshot    = true

  tags {
    Name = "uscis-backend-db"
  }

  lifecycle {
    ignore_changes = ["snapshot_identifier"]
  }
}
