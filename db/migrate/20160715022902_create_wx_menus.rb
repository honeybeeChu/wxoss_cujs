class CreateWxMenus < ActiveRecord::Migration
  def change
    create_table :wx_menus do |t|
      t.integer  "wx_official_account_id", limit: 4
      t.string   "original_id",            limit: 255
      t.string   "name",                   limit: 255
      t.integer  "level",                  limit: 4
      t.integer  "sort",                   limit: 4
      t.string   "parent_id",              limit: 255
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
      t.boolean  "is_show"
      t.string   "key",                    limit: 255
      t.string   "url",                    limit: 255
      t.integer  "msg_type",               limit: 4
      t.string   "msg_content",            limit: 255
    end
  end
end
