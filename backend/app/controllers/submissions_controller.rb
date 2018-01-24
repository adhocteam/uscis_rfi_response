# frozen_string_literal: true

class SubmissionsController < ApplicationController
  before_action :authenticate_admin!, except: [:presigned_url]

  def index
    submissions = Submission.all
    render json: submissions
  end

  def show
    submission = Submission.find(params.fetch(:id))
    render json: submission, include: :customer
  end

  def create
    customer = Customer.find_by(email: params.fetch(:email))
    submission = customer.submissions.create!
    render json: submission, status: :created
  end

  def update
    submission = Submission.find(params.fetch(:id))
    submission.update!(review_params)
    render json: submission
  end

  def presigned_url
    # ensure the submission id is approved
    submission = Submission.find_by(id:params.fetch('submission_id'), status: "requested")
    if not submission
      render json: {'status': 'Error: Invalid Submission ID'}, status: :unauthorized
      return
    end
    begin
      signer = Aws::S3::Presigner.new
      key = "#{params.fetch('submission_id')}-#{params.fetch('image_name')}"
      url = signer.presigned_url(:put_object,
                                 bucket: 'uscis-rfds',
                                 key: key,
                                 acl: 'public-read',
                                 content_type: params.fetch('image_type'))
    rescue Aws::S3::Errors::ServiceError => e
      render json: { 'status': e.to_s }, status: :unauthorized && return
    end
    uri = "https://s3.amazonaws.com/uscis-rfds/" + key
    submission.update(uri: uri, status: "submitted")
    render json: { 'status': 'ok', 'signedUrl': url }
  end

  def new_upload
    existing = Customer.find_by(email: params.fetch("email"))
    if existing
      puts 'i am here'
      submission = Submission.create(status: "requested", customer_id: existing.id)
      puts submission.id
      render json: {'status': 'ok', 'id': submission.id }, status: :ok 
      return
    end
    puts params
    customer =Customer.create(name: params.fetch("name"), dob: params.fetch("dob"),
      email:  params.fetch("email"), street1: params.fetch("street1"),
      street2: params.fetch("street2"), city: params.fetch("city"),
      state: params.fetch("state"), zip: params.fetch("zip"))

    submission = Submission.create(status: "requested", customer_id: customer.id )

    render json: {'status': 'ok', 'id': submission.id }, status: :ok 
    return
  end


  def filter
    status = params.fetch('status')
    submissions = Submission.where(status: status)
    render json: submissions
  end

  private

  def review_params
    params.permit(:status, :notes)
  end
end
