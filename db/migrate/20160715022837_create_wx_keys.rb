class CreateWxKeys < ActiveRecord::Migration
  def change
    create_table :wx_keys do |t|
      t.integer  "wx_key_response_id", limit: 4
      t.string   "key",                limit: 255
      t.boolean  "is_match"
      t.string   "reserved1",          limit: 255
      t.string   "reserved2",          limit: 255
      t.string   "reserved3",          limit: 255
      t.string   "reserved4",          limit: 255
      t.string   "reserved5",          limit: 255
      t.string   "reserved6",          limit: 255
      t.string   "reserved7",          limit: 255
      t.string   "reserved8",          limit: 255
      t.string   "reserved9",          limit: 255
      t.string   "reserved10",         limit: 255
      t.datetime "created_at",                     null: false
      t.datetime "updated_at",                     null: false
    end
  end
end
