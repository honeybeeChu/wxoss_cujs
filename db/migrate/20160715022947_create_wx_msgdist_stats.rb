class CreateWxMsgdistStats < ActiveRecord::Migration
  def change
    create_table :wx_msgdist_stats do |t|
      t.integer "wx_official_account_id", limit: 4
      t.integer "cycle",                  limit: 4
      t.date    "date"
      t.integer "source",                 limit: 4
      t.integer "count_interval",         limit: 4
      t.integer "user",                   limit: 4
    end
  end
end
