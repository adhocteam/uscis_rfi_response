# frozen_string_literal: true

# API Controller
class ApiController < ApplicationController
  def presigned_url
    begin
      signer = Aws::S3::Presigner.new
      key = "#{params.fetch('user_id')}-#{params.fetch('image_name')}"
      url = signer.presigned_url(:put_object,
                                 bucket: 'uscis-rfds',
                                 key: key,
                                 acl: 'public-read',
                                 content_type: params.fetch('image_type'))
    rescue Aws::S3::Errors::ServiceError => e
      render json: { 'status': e.to_s }, status: :unauthorized && return
    end
    render json: { 'status': 'ok', 'signedUrl': url }
  end

  # creates a user and sends them an email
  def request_upload
    begin
      ses = Aws::SES::Client.new
      email = params.fetch('email')
      user_id = params.fetch('user_id')
      # add EMAIL_SOURCE to .env 
      source = ENV.fetch("EMAIL_SOURCE")
      subject = "Admin has requested you to upload a photo."
      body = "Admin has requsted you upload a photo: http://localhost:3000?id=#{user_id}"
      ses.send_email({
        source: source,
        destination:{
          to_addresses: [source]
        },
        message: {
          subject: {
            data: subject
          },
          body: {
            text: {
              data: body
            }
          }
        }
      })
    rescue  Aws::SES::Errors::ServiceError => e
      render json: { 'status': e.to_s }, status: :unauthorized && return
    end
    render json: {'status': 'sent'}
  end
end
