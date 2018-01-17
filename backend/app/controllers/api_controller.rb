class ApiController < ApplicationController
  def upload
    # params is the hash containing
    #   {
    #     "user_id": "e3ca6d96454e4a508a677e9e6c3dc3e3",
    #     "image_name": "my cat.jpg",
    #     "image_base64": "f3u4o2igowh8390t4h8w39th40389wth48390whl…",
    #     "timestamp": "2018-01-16T17:00:03-05:00"
    #   }
    image = Base64.decode64(params["image_base64"])
    begin
      # XXX: kick out to a job?
      s3 = Aws::S3::Resource.new(region:'us-east-1')
      obj = s3.bucket('uscis-rfds').object("#{params["user_id"]}-#{params["timestamp"]}.png")
      resp = obj.put(body: image)
    rescue Aws::S3::Errors::ServiceError => e
      render json: {"status": "#{e}"}, status: :unauthorized and return
    end
    render json: {"status": "accepted"}
  end

  def presigned_url
    begin
      signer = Aws::S3::Presigner.new
      key = "#{params['user_id']}-#{params['image_name']}"
      # XXX: figure out content type
      url = signer.presigned_url(:put_object,
                                 bucket: 'uscis-rfds',
                                 key: key,
                                 acl: 'public-read',
                                 content_type: 'image/png')
    rescue Aws::S3::Errors::ServiceError => e
      render json: {"status": "#{e}"}, status: :unauthorized and return
    end
    render json: {"status": "ok", "url": url}

  end
end
