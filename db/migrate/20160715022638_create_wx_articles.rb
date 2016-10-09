class CreateWxArticles < ActiveRecord::Migration
  def change
    create_table :wx_articles do |t|
      t.string   "title",                  limit: 255
      t.string   "author",                 limit: 255
      t.string   "digest",                 limit: 255
      t.string   "thumb_media_id",         limit: 255
      t.integer  "show_cover_pic",         limit: 4
      t.text     "content",                limit: 65535
      t.string   "content_source_url",     limit: 255
      t.integer  "cover_file_id",          limit: 4
      t.string   "content_url",            limit: 255
      t.string   "news_id",                limit: 255
      t.integer  "index",                  limit: 4
      t.string   "media_id",               limit: 255
      t.integer  "wx_official_account_id", limit: 4
      t.datetime "created_at",                           null: false
      t.datetime "updated_at",                           null: false
    end
    add_index "wx_articles", ["wx_official_account_id"], name: "index_wx_articles_on_wx_official_account_id", using: :btree
  end
end
