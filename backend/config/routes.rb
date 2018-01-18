# frozen_string_literal: true

Rails.application.routes.draw do
  post 'api/presigned_url'
  post 'api/request_upload'
end
