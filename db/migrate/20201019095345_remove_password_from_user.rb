class RemovePasswordFromUser < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :pass, :string
  end
end
