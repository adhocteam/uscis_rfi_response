# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post 'api/presigned_url'
  resources :submissions, only: [:index, :show, :create, :update]
end
