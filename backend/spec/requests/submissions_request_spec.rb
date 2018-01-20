# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SubmissionsController, type: :request do
  before(:each) do
    customer = Customer.create!(
      :name => Faker::Name.name,
      :email => Faker::Internet.email,
      :street1 => Faker::Address.street_address,
      :street2 => Faker::Address.secondary_address,
      :city => Faker::Address.city,
      :state => Faker::Address.state,
      :zip => Faker::Address.zip,
      :dob => Faker::Date.between(18.years.ago, 80.years.ago)
    )

    submission = Submission.new(
      :timestamp => Faker::Time.between(DateTime.now - 1, DateTime.now),
      :uri => Faker::Internet.url,
      :status => :submitted,
      :notes => Faker::Lorem.sentence
    )

    submission.customer = customer

    submission.save
  end

  describe 'get #index' do
    it 'returns http success' do
      get submissions_path
      expect(response).to have_http_status(:success)
      expect(response.content_type).to eq('application/json')
      body = JSON.parse(response.body)
      submission = Submission.first
      expect(body[0]).to match(hash_including({
        "customer_id" => submission.customer_id,
        "timestamp" => submission.timestamp,
        "uri" => submission.uri,
        "status" => submission.status,
        "notes" => submission.notes
      }))
    end
  end

  describe 'get #show' do
    it 'returns http success' do
      get submission_path(Submission.first.id)
      expect(response).to have_http_status(:success)
      expect(response.content_type).to eq('application/json')
      body = JSON.parse(response.body)
      puts body
      submission = Submission.first
      expect(body).to match(hash_including({
        "timestamp" => submission.timestamp,
        "uri" => submission.uri,
        "status" => submission.status,
        "notes" => submission.notes,
        "customer" => hash_including({ "id" => submission.customer_id })
      }))
    end
  end
end

