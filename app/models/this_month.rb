class ThisMonth < ApplicationRecord
    validates :user_id, {presence: true}
end
