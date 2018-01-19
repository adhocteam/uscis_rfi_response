# frozen_string_literal: true

class SubmissionsController < ApplicationController
  def index
    @submissions = Submission.all
    render json: @submissions
  end

  def show
    @submission = Submission.find(params[:id])
    render json: @submission, include: :user
  end

  def create
  end

  def update
  end
end
