class CreateWxResources < ActiveRecord::Migration
  def change
    create_table :wx_resources do |t|
      t.integer  "wx_official_account_id", limit: 4
      t.string   "original_id",            limit: 255
      t.string   "resource_name",          limit: 255
      t.string   "file_url",               limit: 60
      t.string   "media_id",               limit: 255
      t.string   "wx_url",                 limit: 255
      t.integer  "resource_type",          limit: 4
      t.integer  "wx_resource_group_id",   limit: 4
      t.string   "column",                 limit: 255
      t.string   "fomat",                  limit: 255
      t.integer  "resource_size",          limit: 4
      t.boolean  "deleted",                            default: false
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
      t.datetime "created_at",                                         null: false
      t.datetime "updated_at",                                         null: false
    end
  end
end
