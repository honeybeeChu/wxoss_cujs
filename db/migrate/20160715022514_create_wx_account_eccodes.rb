class CreateWxAccountEccodes < ActiveRecord::Migration
  def change
    create_table :wx_account_eccodes do |t|
      t.string   "eccode",                 limit: 40
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
