class CreateWxUserStats < ActiveRecord::Migration
  def change
    create_table :wx_user_stats do |t|
      t.integer  "wx_official_account_id", limit: 4
      t.date     "date"
      t.integer  "user_source",            limit: 4
      t.integer  "new_user",               limit: 4
      t.integer  "cancel_user",            limit: 4
      t.integer  "cumulate_user",          limit: 4
      t.datetime "created_at",                       null: false
      t.datetime "updated_at",                       null: false
    end
  end
end
