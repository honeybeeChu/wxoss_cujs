class CreateWxOfficialAccounts < ActiveRecord::Migration
  def change
    create_table :wx_official_accounts do |t|
      t.string   "original_id",       limit: 255
      t.string   "wechat_name",       limit: 255
      t.string   "wechat_account",    limit: 255
      t.integer  "wechat_type",       limit: 4
      t.string   "app_id",            limit: 255
      t.string   "app_secret",        limit: 255
      t.string   "access_token",      limit: 255
      t.string   "encoding_aes_key",  limit: 255
      t.integer  "accesstype",        limit: 4
      t.string   "weixin_secret_key", limit: 255
      t.string   "weixin_token",      limit: 255
      t.integer  "resource_flag",     limit: 4
      t.integer  "reserved1",         limit: 4
      t.integer  "reserved2",         limit: 4
      t.string   "reserved3",         limit: 40
      t.string   "reserved4",         limit: 40
      t.string   "reserved5",         limit: 40
      t.string   "reserved6",         limit: 40
      t.string   "reserved7",         limit: 80
      t.string   "reserved8",         limit: 80
      t.string   "reserved9",         limit: 255
      t.string   "reserved10",        limit: 255
      t.datetime "expired_at"
    end
    add_index "wx_official_accounts", ["weixin_secret_key"], name: "index_wx_official_accounts_on_weixin_secret_key", using: :btree
    add_index "wx_official_accounts", ["weixin_token"], name: "index_wx_official_accounts_on_weixin_token", using: :btree

  end
end
