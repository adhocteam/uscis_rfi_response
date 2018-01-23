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

  def status
    filter=params.fetch('filter')
    submissions = Submission.where(status: filter)
    render json: submissions
  end

  private

  def review_params
    params.permit(:status, :notes)
  end
end
