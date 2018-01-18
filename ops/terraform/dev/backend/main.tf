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

  env = "dev"

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

# For env variable and secret storage
resource "aws_s3_bucket" "uscis_backend_config_vars" {
  bucket = "uscis-backend-config-vars"
  acl    = "private"
}

resource "aws_kms_key" "uscis_backend_config_vars" {
  description             = "USCIS Backend configuration variables and secrets"
  deletion_window_in_days = 7
}

resource "aws_kms_alias" "uscis_backend_config_vars" {
  name          = "alias/uscis_backend"
  target_key_id = "${aws_kms_key.uscis_backend_config_vars.key_id}"
}

resource "aws_s3_bucket_policy" "uscis_backend_config_vars" {
  bucket = "${aws_s3_bucket.uscis_backend_config_vars.id}"
  policy =<<POLICY
{
   "Version": "2012-10-17",
   "Id": "PutObjPolicy",
   "Statement": [
         {
              "Sid": "DenyIncorrectEncryptionHeader",
              "Effect": "Deny",
              "Principal": "*",
              "Action": "s3:PutObject",
              "Resource": "arn:aws:s3:::uscis-backend-config-vars/*",
              "Condition": {
                      "StringNotEquals": {
                             "s3:x-amz-server-side-encryption": "aws:kms"
                       }
              }
         },
         {
              "Sid": "DenyUnEncryptedObjectUploads",
              "Effect": "Deny",
              "Principal": "*",
              "Action": "s3:PutObject",
              "Resource": "arn:aws:s3:::uscis-backend-config-vars/*",
              "Condition": {
                      "Null": {
                             "s3:x-amz-server-side-encryption": true
                      }
             }
         }
   ]
}
POLICY
}
