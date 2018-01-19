# frozen_string_literal: true

class Submission < ApplicationRecord
  belongs_to :user
  enum status: [ :requested, :submitted, :approved, :rejected ]

  after_initialize { self.uuid = SecureRandom.uuid }
end
