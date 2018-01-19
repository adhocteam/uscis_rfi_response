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
    # insert record
    # TODO: ensure you can't double insert the same email
    email = params.fetch('email')
    dob = params.fetch('dob')
    name = params.fetch('name')
    street1 = params.fetch('street1')
    street2= params.fetch('street2')
    city = params.fetch('city')
    state= params.fetch('state')
    zip= params.fetch('zip')
    user_id = SecureRandom.uuid
    # create user
    User.create(uuid: user_id, name: name, 
      email: email, street1: street1, 
      street2: street2, city: city, state: state, zip:zip, 
      dob: dob, role: 1)
    domain = ENV.fetch("DOMAIN")
    source = ENV.fetch("EMAIL_SOURCE")
    subject = "Admin has requsted you to upload a photo."
    body = "Admin has requsted you upload a photo: #{domain}?id=#{user_id}"

    begin
      # send email to user
      ses = Aws::SES::Client.new

      ses.send_email({
        source: source,
        destination:{
          to_addresses: [email]
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
