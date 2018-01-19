class AddUuidToSubmissions < ActiveRecord::Migration[5.1]
  def up
    add_column :submissions, :uuid, :string, unique: true
  end

  def down
    remove_column :submissions, :uuid
  end
end
