class SubmissionsController < ApplicationController
  def index
    @submissions = Submission.all
    render json: @submissions
  end

  def show
    @submission = Submission.find(params[:id])
    render json: @submission
  end

  def create
  end

  def update
  end
end
