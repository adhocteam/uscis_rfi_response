# frozen_string_literal: true

class Submission < ApplicationRecord
  belongs_to :user, foreign_key: :user_uuid, primary_key: :uuid
  enum status: [ :requested, :submitted, :approved, :rejected ]
end
