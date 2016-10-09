class CreateWxMsgStatHours < ActiveRecord::Migration
  def change
    create_table :wx_msg_stat_hours do |t|
      t.integer "wx_official_account_id", limit: 4
      t.date    "date"
      t.string  "hour",                   limit: 255
      t.integer "source",                 limit: 4
      t.integer "msg_type",               limit: 4
      t.integer "user",                   limit: 4
      t.integer "count",                  limit: 4
    end
  end
end
