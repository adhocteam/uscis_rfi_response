class CreateSubmissions < ActiveRecord::Migration[5.1]
  def change
    create_table :submissions, id: :uuid do |t|
      t.datetime :timestamp
      t.string :uri
      t.integer :status
      t.text :notes
      t.references :customer, foreign_key: true

      t.timestamps
    end
  end
end
