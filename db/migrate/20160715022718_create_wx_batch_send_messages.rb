class CreateWxBatchSendMessages < ActiveRecord::Migration
  def change
    create_table :wx_batch_send_messages do |t|
      t.integer  "msg_type",               limit: 4
      t.string   "msg_content",            limit: 255
      t.integer  "wx_user_group_id",       limit: 4
      t.integer  "gender",                 limit: 4
      t.integer  "wx_country_id",          limit: 4
      t.integer  "wx_province_id",         limit: 4
      t.integer  "wx_city_id",             limit: 4
      t.integer  "wx_official_account_id", limit: 4
      t.datetime "create_time",                        null: false
      t.integer  "is_deleted",             limit: 4
      t.string   "msg_id",                 limit: 255
      t.string   "msg_data_id",            limit: 255
      t.string   "msg_status",             limit: 255
      t.integer  "totalCount",             limit: 4
      t.integer  "filterCount",            limit: 4
      t.integer  "sentCount",              limit: 4
      t.integer  "errorCount",             limit: 4
    end
  end
end
