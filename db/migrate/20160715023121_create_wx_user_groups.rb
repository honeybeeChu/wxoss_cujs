class CreateWxUserGroups < ActiveRecord::Migration
  def change
    create_table :wx_user_groups do |t|
      t.integer  "groupid",                limit: 4,  default: 0, null: false
      t.string   "name",                   limit: 12
      t.integer  "count",                  limit: 4,  default: 0
      t.integer  "wx_official_account_id", limit: 4,  default: 0, null: false
      t.datetime "create_time",                                   null: false
    end
  end
end
