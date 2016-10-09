class CreateWxActivities < ActiveRecord::Migration
  def change
    create_table :wx_activities do |t|
      t.integer  "activity_type",          limit: 4
      t.string   "name",                   limit: 255
      t.integer  "status",                 limit: 4
      t.datetime "begintime"
      t.datetime "endtime"
      t.string   "description",            limit: 255
      t.string   "qrcode_url",             limit: 255
      t.integer  "maxcount",               limit: 4
      t.integer  "lottery_num",            limit: 4
      t.boolean  "is_repeat_draw"
      t.integer  "receive_way",            limit: 4
      t.string   "receive_info",           limit: 255
      t.string   "offline_address",        limit: 255
      t.string   "offline_description",    limit: 255
      t.integer  "wx_official_account_id", limit: 4
      t.integer  "reserved1",              limit: 4
      t.integer  "reserved2",              limit: 4
      t.string   "reserved3",              limit: 40
      t.string   "reserved4",              limit: 40
      t.string   "reserved5",              limit: 40
      t.string   "reserved6",              limit: 40
      t.string   "reserved7",              limit: 80
      t.string   "reserved8",              limit: 80
      t.string   "reserved9",              limit: 255
      t.string   "reserved10",             limit: 255
      t.datetime "created_at",                         null: false
      t.datetime "updated_at",                         null: false
    end
  end
end
