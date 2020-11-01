class CreateGuestUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :guest_users do |t|
      t.integer :user_id
      t.string :name

      t.timestamps
    end
  end
end
