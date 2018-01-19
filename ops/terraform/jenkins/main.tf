provider "aws" {
  region = "us-east-1"
}

data "aws_caller_identity" "current" {}

module "uscis_shared_vpc" {
  source   = "../modules/vpc"
  vpc_name = "uscis-shared-vpc"
  az_count = 1
}

data "aws_ami" "aws_linux" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn-ami-hvm-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  owners = ["amazon"]
}

data "aws_kms_alias" "uscis_backend" {
  name = "alias/uscis_backend"
}

resource "aws_security_group" "ssh" {
  name        = "ssh"
  description = "Allow SSH connections"
  vpc_id      = "${module.uscis_shared_vpc.vpc_id}"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "http" {
  name        = "http"
  description = "Allow HTTP connections"
  vpc_id      = "${module.uscis_shared_vpc.vpc_id}"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_instance_profile" "uscis_jenkins_profile" {
  name = "tf-uscis-jenkins-profile"
  role = "${aws_iam_role.uscis_jenkins_role.name}"
}

resource "aws_iam_role" "uscis_jenkins_role" {
  name = "tf-uscis-jenkins-role"
  path = "/"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ec2.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
EOF
}

data "template_file" "uscis_jenkins_policy" {
  template = "${file("${path.module}/templates/jenkins.json")}"

  vars {
    account_id = "${data.aws_caller_identity.current.account_id}"
  }
}

resource "aws_iam_role_policy" "uscis_jenkins_policy" {
  name   = "tf-uscis-jenkins-policy"
  role   = "${aws_iam_role.uscis_jenkins_role.id}"
  policy = "${data.template_file.uscis_jenkins_policy.rendered}"
}

resource "aws_instance" "jenkins" {
  ami                         = "${data.aws_ami.aws_linux.id}"
  instance_type               = "t2.small"
  key_name                    = "ecs"
  vpc_security_group_ids      = ["${aws_security_group.ssh.id}", "${aws_security_group.http.id}"]
  subnet_id                   = "${element(module.uscis_shared_vpc.subnets_ids, 0)}"
  associate_public_ip_address = true
  iam_instance_profile        = "tf-uscis-jenkins-profile"

  root_block_device {
    volume_type = "standard"
    volume_size = 30
  }

  tags {
    Name = "uscis-jenkins"
  }
}

resource "aws_ebs_volume" "docker_home" {
  availability_zone = "${aws_instance.jenkins.availability_zone}"
  type              = "gp2"
  size              = 100
  encrypted         = true
  kms_key_id        = "arn:aws:kms:us-east-1:${data.aws_caller_identity.current.account_id}:key/${data.aws_kms_alias.uscis_backend.target_key_id}"

  tags {
    Name = "uscis-docker-home"
  }
}

resource "aws_volume_attachment" "ebs_one" {
  device_name = "/dev/sdh"
  volume_id   = "${aws_ebs_volume.docker_home.id}"
  instance_id = "${aws_instance.jenkins.id}"
}

resource "aws_ebs_volume" "jenkins_home" {
  availability_zone = "${aws_instance.jenkins.availability_zone}"
  type              = "gp2"
  size              = 100
  encrypted         = true
  kms_key_id        = "arn:aws:kms:us-east-1:${data.aws_caller_identity.current.account_id}:key/${data.aws_kms_alias.uscis_backend.target_key_id}"

  tags {
    Name = "uscis-jenkins-home"
  }
}

resource "aws_volume_attachment" "ebs_two" {
  device_name = "/dev/sdg"
  volume_id   = "${aws_ebs_volume.jenkins_home.id}"
  instance_id = "${aws_instance.jenkins.id}"
}
