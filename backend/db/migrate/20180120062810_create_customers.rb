class CreateCustomers < ActiveRecord::Migration[5.1]
  def change
    create_table :customers do |t|
      t.string :name
      t.string :email
      t.string :street1
      t.string :street2
      t.string :city
      t.string :state
      t.string :zip
      t.date :dob

      t.timestamps
    end
  end
end
