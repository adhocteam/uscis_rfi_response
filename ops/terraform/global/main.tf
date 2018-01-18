provider "aws" {
  region = "us-east-1"
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
