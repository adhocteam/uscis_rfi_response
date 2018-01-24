### Network

data "aws_availability_zones" "available" {}

resource "aws_vpc" "main" {
  cidr_block = "10.10.0.0/16"

  # TODO(rnagle): use dedicated instances?
  #instance_tenancy = "dedicated"

  tags {
    Name = "ecs-${var.vpc_name}"
  }
}

resource "aws_subnet" "main" {
  count             = "${var.az_count}"
  cidr_block        = "${cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)}"
  availability_zone = "${data.aws_availability_zones.available.names[count.index]}"
  vpc_id            = "${aws_vpc.main.id}"

  tags {
    Name = "ecs-${var.vpc_name}-dmz"
  }
}

resource "aws_subnet" "app" {
  count             = "${var.az_count}"
  cidr_block        = "${cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 2)}"
  availability_zone = "${data.aws_availability_zones.available.names[count.index]}"
  vpc_id            = "${aws_vpc.main.id}"

  tags {
    Name = "ecs-${var.vpc_name}-app"
  }
}

resource "aws_subnet" "data" {
  count             = "${var.az_count}"
  cidr_block        = "${cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 4)}"
  availability_zone = "${data.aws_availability_zones.available.names[count.index]}"
  vpc_id            = "${aws_vpc.main.id}"

  tags {
    Name = "ecs-${var.vpc_name}-data"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = "${aws_vpc.main.id}"

  tags {
    Name = "ecs-${var.vpc_name}"
  }
}

resource "aws_route_table" "r" {
  vpc_id = "${aws_vpc.main.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.gw.id}"
  }

  tags {
    Name = "ecs-${var.vpc_name}"
  }
}

resource "aws_route_table_association" "a" {
  count          = "${var.az_count}"
  subnet_id      = "${element(aws_subnet.main.*.id, count.index)}"
  route_table_id = "${aws_route_table.r.id}"
}

## NAT gateway for private subnets

# TODO(rnagle): gateways for each AZ, separate route tables for each app subnet

resource "aws_eip" "eip" {
  vpc   = true
}

resource "aws_nat_gateway" "dmz" {
  allocation_id = "${aws_eip.eip.id}"
  subnet_id     = "${element(aws_subnet.main.*.id, 0)}"

  depends_on = ["aws_internet_gateway.gw"]
}

resource "aws_route_table" "app_r" {
  vpc_id = "${aws_vpc.main.id}"

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = "${aws_nat_gateway.dmz.id}"
  }

  tags = {
    Name = "uscis-app-subnet-route-table"
  }
}

resource "aws_route_table_association" "b" {
  count          = "${var.az_count}"
  subnet_id      = "${element(aws_subnet.app.*.id, count.index)}"
  route_table_id = "${aws_route_table.app_r.id}"
}
