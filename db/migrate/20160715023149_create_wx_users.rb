class CreateWxUsers < ActiveRecord::Migration
  def change
    create_table :wx_users do |t|
      t.string  "openid",                 limit: 255
      t.string  "nickname",               limit: 255
      t.integer "sex",                    limit: 4
      t.string  "language",               limit: 255
      t.string  "city",                   limit: 255
      t.string  "province",               limit: 255
      t.string  "country",                limit: 255
      t.string  "headimgurl",             limit: 255
      t.string  "subscribe_time",         limit: 255
      t.string  "unionid",                limit: 255
      t.string  "remark",                 limit: 255
      t.integer "groupid",                limit: 4
      t.integer "subscribe",              limit: 4
      t.string  "phone",                  limit: 255
      t.integer "wx_official_account_id", limit: 4
    end
    add_index "wx_users", ["nickname"], name: "index_wx_users_on_nickname", using: :btree
    add_index "wx_users", ["wx_official_account_id"], name: "index_wx_users_on_wx_official_account_id", using: :btree

  end
end
