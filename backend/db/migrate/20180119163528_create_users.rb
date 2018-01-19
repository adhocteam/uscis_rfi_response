class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    change_table :users do |t|
      t.string :street1
      t.string :street2
      t.string :city
      t.string :state
      t.string :zip
      t.date :dob
      t.integer :role
    end
  end
end
