# frozen_string_literal: true

class AdminsController < ApplicationController
  before_action :authenticate_admin!

  def show
    render json: current_admin
  end
end
