provider "aws" {
  region = "us-east-1"
}

## EC2

### Compute

resource "aws_autoscaling_group" "app" {
  name                 = "tf-${var.container_name}-asg"
  vpc_zone_identifier  = ["${var.subnet_ids}"]
  min_size             = "${var.asg_min}"
  max_size             = "${var.asg_max}"
  desired_capacity     = "${var.asg_desired}"
  launch_configuration = "${aws_launch_configuration.app.name}"

  tag {
    key                 = "Name"
    value               = "ecs-${var.container_name}"
    propagate_at_launch = true
  }
}

data "aws_ami" "ecs_ami" {
  most_recent = true

  filter {
    name   = "name"
    values = ["*-ecs-optimized"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["amazon"]
}

resource "aws_launch_configuration" "app" {
  security_groups = [
    "${aws_security_group.instance_sg.id}",
  ]

  key_name             = "${var.key_name}"
  image_id             = "${data.aws_ami.ecs_ami.id}"
  instance_type        = "${var.instance_type}"
  iam_instance_profile = "${aws_iam_instance_profile.app.name}"

  user_data = <<EOF
#!/bin/bash
echo ECS_CLUSTER=${aws_ecs_cluster.main.name} >> /etc/ecs/ecs.config
EOF

  # TODO(rnagle): do not assign public IP addresses
  associate_public_ip_address = true

  lifecycle {
    create_before_destroy = true
  }
}

### Security

resource "aws_security_group" "lb_sg" {
  description = "controls access to the application ELB"

  vpc_id = "${var.vpc_id}"
  name   = "ecs-${var.container_name}-lb-sg"

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"

    cidr_blocks = [
      "0.0.0.0/0",
    ]
  }

  tags {
    Name = "ecs-${var.container_name}-lb-sg"
  }
}

resource "aws_security_group" "instance_sg" {
  description = "controls direct access to application instances"
  vpc_id      = "${var.vpc_id}"
  name        = "ecs-${var.container_name}-instsg"

  ingress {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22

    cidr_blocks = [
      "${var.admin_cidr_ingress}",
    ]
  }

  ingress {
    protocol  = "tcp"
    from_port = "${var.host_port}"
    to_port   = "${var.host_port}"

    security_groups = [
      "${aws_security_group.lb_sg.id}",
    ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "ecs-${var.container_name}-instance-sg"
  }
}

## ECS

resource "aws_ecs_cluster" "main" {
  name = "terraform-${var.container_name}-ecs-cluster"
}

data "template_file" "task_definition" {
  template = "${file("${path.module}/templates/task-definition.json")}"

  # TODO(rnagle): add the ability to specify a command
  vars {
    image_url      = "${var.ecr_img_url}:latest"
    container_name = "${var.container_name}"
    container_port = "${var.container_port}"
    host_port      = "${var.host_port}"
  }
}

resource "aws_ecs_task_definition" "app_task_def" {
  family                = "${var.container_name}-task-def"
  container_definitions = "${data.template_file.task_definition.rendered}"
}

resource "aws_ecs_service" "main" {
  name            = "tf-ecs-${var.container_name}"
  cluster         = "${aws_ecs_cluster.main.id}"
  task_definition = "${aws_ecs_task_definition.app_task_def.arn}"
  desired_count   = 1
  iam_role        = "${aws_iam_role.ecs_service.name}"

  health_check_grace_period_seconds  = 60
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100

  load_balancer {
    target_group_arn = "${aws_alb_target_group.main.id}"
    container_name   = "${var.container_name}"
    container_port   = "${var.container_port}"
  }

  depends_on = [
    "aws_iam_role_policy.ecs_service",
    "aws_alb_listener.front_end",
  ]
}

## IAM

resource "aws_iam_role" "ecs_service" {
  name = "tf-${var.container_name}-ecs-role"

  assume_role_policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "ecs_service" {
  name = "tf-${var.container_name}-ecs-policy"
  role = "${aws_iam_role.ecs_service.name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
        "elasticloadbalancing:DeregisterTargets",
        "elasticloadbalancing:Describe*",
        "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
        "elasticloadbalancing:RegisterTargets"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_instance_profile" "app" {
  name = "tf-ecs-instprofile"
  role = "${aws_iam_role.app_instance.name}"
}

resource "aws_iam_role" "app_instance" {
  name = "tf-ecs-${var.container_name}-instance-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

data "template_file" "instance_profile" {
  template = "${file("${path.module}/templates/instance-profile-policy.json")}"
}

resource "aws_iam_role_policy" "instance" {
  name   = "tf-ecs-${var.container_name}-instance-role"
  role   = "${aws_iam_role.app_instance.name}"
  policy = "${data.template_file.instance_profile.rendered}"
}

## ALB

resource "aws_alb_target_group" "main" {
  name     = "tf-ecs-${var.container_name}"
  port     = 80
  protocol = "HTTP"
  vpc_id   = "${var.vpc_id}"

  tags {
    Name = "ecs-${var.container_name}"
  }
}

resource "aws_alb" "main" {
  name            = "tf-${var.container_name}-alb-ecs"
  subnets         = ["${var.subnet_ids}"]
  security_groups = ["${aws_security_group.lb_sg.id}"]

  tags {
    Name = "ecs-${var.container_name}"
  }
}

resource "aws_alb_listener" "front_end" {
  load_balancer_arn = "${aws_alb.main.id}"
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.main.id}"
    type             = "forward"
  }
}
