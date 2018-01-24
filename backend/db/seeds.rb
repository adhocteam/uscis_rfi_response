# to run:
# docker-compose run backend rake db:seed
10.times do
    customer = Customer.create!(
      name: Faker::Name.name,
      email: Faker::Internet.email,
      street1: Faker::Address.street_address,
      street2: Faker::Address.secondary_address,
      city: Faker::Address.city,
      state: Faker::Address.state,
      zip: Faker::Address.zip,
      dob: Faker::Date.between(18.years.ago, 80.years.ago)
    )

    submission = Submission.new(
      timestamp: Faker::Time.between(Time.current - 1.day, Time.current),
      uri: Faker::Internet.url,
      notes: Faker::Lorem.sentence
    )

    submission.customer = customer

    submission.save
end
