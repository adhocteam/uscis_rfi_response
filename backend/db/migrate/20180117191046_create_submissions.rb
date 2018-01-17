class CreateSubmissions < ActiveRecord::Migration[5.1]
  def change
    create_table :submissions do |t|
      t.string :user_uuid
      t.primary_key :id
      t.datetime :timestamp
      t.string :uri
      t.integer :status
      t.text :notes

      t.timestamps
    end
  end
end
