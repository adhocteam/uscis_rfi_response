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

resource "aws_security_group" "ssh" {
  name        = "ssh"
  description = "Allow SSH connections"
  vpc_id      = "${data.aws_vpc.uscis_vpc.id}"

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

  tags {
    Name = "uscis bastion ssh"
  }
}

resource "aws_instance" "bastion" {
  ami                         = "${data.aws_ami.aws_linux.id}"
  instance_type               = "t2.nano"
  key_name                    = "ecs"
  vpc_security_group_ids      = ["${aws_security_group.ssh.id}"]
  subnet_id                   = "${element(data.aws_subnet_ids.uscis_dmz_subnet_ids.ids, 0)}"
  associate_public_ip_address = true

  tags {
    Name = "uscis-bastion"
  }
}
