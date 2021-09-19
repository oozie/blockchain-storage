resource "aws_s3_bucket" "storage" {
  bucket = "${var.domain}"

  tags = {
    Environment = "PROD"
  }

  grant {
    type        = "Group"
    uri         = "http://acs.amazonaws.com/groups/global/AllUsers"
    permissions = ["READ"]
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 2592000
  }

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

}

resource "aws_s3_bucket_policy" "public-by-default" {
  bucket = aws_s3_bucket.storage.id

  policy = <<POLICY
{
    "Version": "2008-10-17",
    "Id": "public-by-default",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${aws_s3_bucket.storage.id}/*"
        }
    ]
}
POLICY

}

