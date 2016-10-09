class CreateWxMsgStats < ActiveRecord::Migration
  def change
    create_table :wx_msg_stats do |t|
      t.integer "wx_official_account_id", limit: 4
      t.integer "cycle",                  limit: 4
      t.date    "date"
      t.integer "source",                 limit: 4
      t.integer "msg_type",               limit: 4
      t.integer "user",                   limit: 4
      t.integer "count",                  limit: 4
    end
  end
end
