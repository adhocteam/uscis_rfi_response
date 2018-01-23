# frozen_string_literal: true

class Submission < ApplicationRecord
  belongs_to :customer
  enum status: [ :requested, :submitted, :approved, :denied ]
  after_initialize { self.status = :requested if self.new_record? }
end
