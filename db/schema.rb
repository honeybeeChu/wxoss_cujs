# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160919025435) do

  create_table "m_function_url_filters", force: :cascade do |t|
    t.string   "funcid",      limit: 255
    t.integer  "systemid",    limit: 4
    t.integer  "matchtype",   limit: 4
    t.text     "urlpattern",  limit: 65535
    t.string   "matchresult", limit: 255
    t.integer  "priority",    limit: 4
    t.text     "description", limit: 65535
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "m_functions", force: :cascade do |t|
    t.string   "funcid",            limit: 255
    t.integer  "systemid",          limit: 4
    t.string   "name",              limit: 255
    t.integer  "optype",            limit: 4
    t.text     "indexurl",          limit: 65535
    t.text     "groupnolist",       limit: 65535
    t.text     "securitylevellist", limit: 65535
    t.text     "description",       limit: 65535
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  create_table "m_menu_functions", force: :cascade do |t|
    t.string   "funcid",      limit: 255
    t.integer  "systemid",    limit: 4
    t.string   "nodeid",      limit: 255
    t.string   "layout",      limit: 255
    t.string   "bstyle",      limit: 255
    t.text     "description", limit: 65535
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "m_menu_trees", force: :cascade do |t|
    t.string   "nodeid",       limit: 255
    t.integer  "systemid",     limit: 4
    t.integer  "nodetype",     limit: 4
    t.string   "parentnodeid", limit: 255
    t.string   "label",        limit: 255
    t.string   "info",         limit: 255
    t.text     "description",  limit: 65535
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "wx_account_eccodes", force: :cascade do |t|
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

  create_table "wx_activities", force: :cascade do |t|
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

  create_table "wx_activity_awards", force: :cascade do |t|
    t.integer  "wx_activity_id", limit: 4
    t.integer  "level",          limit: 4
    t.string   "name",           limit: 255
    t.string   "imgurl",         limit: 255
    t.integer  "amount",         limit: 4
    t.integer  "probability",    limit: 4
    t.integer  "reserved1",      limit: 4
    t.integer  "reserved2",      limit: 4
    t.string   "reserved3",      limit: 40
    t.string   "reserved4",      limit: 40
    t.string   "reserved5",      limit: 40
    t.string   "reserved6",      limit: 40
    t.string   "reserved7",      limit: 80
    t.string   "reserved8",      limit: 80
    t.string   "reserved9",      limit: 255
    t.string   "reserved10",     limit: 255
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "wx_activity_users", force: :cascade do |t|
    t.integer  "wx_activity_id", limit: 4
    t.string   "openid",         limit: 255
    t.integer  "award_level",    limit: 4
    t.integer  "shake_count",    limit: 4
    t.string   "realname",       limit: 255
    t.string   "telephone",      limit: 255
    t.string   "address",        limit: 255
    t.integer  "reserved1",      limit: 4
    t.integer  "reserved2",      limit: 4
    t.string   "reserved3",      limit: 40
    t.string   "reserved4",      limit: 40
    t.string   "reserved5",      limit: 40
    t.string   "reserved6",      limit: 40
    t.string   "reserved7",      limit: 80
    t.string   "reserved8",      limit: 80
    t.string   "reserved9",      limit: 255
    t.string   "reserved10",     limit: 255
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "wx_articles", force: :cascade do |t|
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

  create_table "wx_auto_responses", force: :cascade do |t|
    t.integer  "wx_official_account_id", limit: 4
    t.string   "original_id",            limit: 255
    t.integer  "res_type",               limit: 4
    t.string   "res_content",            limit: 255
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
    t.integer  "event_type",             limit: 4
  end

  create_table "wx_batch_send_messages", force: :cascade do |t|
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

  create_table "wx_cities", force: :cascade do |t|
    t.integer "wx_country_id",  limit: 4
    t.integer "wx_province_id", limit: 4
    t.string  "city_name",      limit: 255
    t.integer "city_code",      limit: 4
  end

  create_table "wx_countries", force: :cascade do |t|
    t.string  "country_name", limit: 255
    t.integer "country_code", limit: 4
  end

  create_table "wx_interface_stat_hours", force: :cascade do |t|
    t.integer "wx_official_account_id", limit: 4
    t.date    "date"
    t.string  "hour",                   limit: 255
    t.integer "callback_count",         limit: 4
    t.integer "fail_count",             limit: 4
    t.integer "total_time_cost",        limit: 4
    t.integer "max_time_cost",          limit: 4
  end

  create_table "wx_interface_stats", force: :cascade do |t|
    t.integer "wx_official_account_id", limit: 4
    t.date    "date"
    t.integer "callback_count",         limit: 4
    t.integer "fail_count",             limit: 4
    t.integer "total_time_cost",        limit: 4
    t.integer "max_time_cost",          limit: 4
  end

  create_table "wx_key_responses", force: :cascade do |t|
    t.integer  "wx_official_account_id", limit: 4
    t.string   "original_id",            limit: 255
    t.string   "rule_name",              limit: 255
    t.boolean  "is_response_all"
    t.integer  "resource_size",          limit: 4
    t.string   "reserved1",              limit: 255
    t.string   "reserved2",              limit: 255
    t.string   "reserved3",              limit: 255
    t.string   "reserved4",              limit: 255
    t.string   "reserved5",              limit: 255
    t.string   "reserved6",              limit: 255
    t.string   "reserved7",              limit: 255
    t.string   "reserved8",              limit: 255
    t.string   "reserved9",              limit: 255
    t.string   "reserved10",             limit: 255
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
  end

  create_table "wx_keys", force: :cascade do |t|
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

  create_table "wx_m_enterpriseclients", force: :cascade do |t|
    t.string   "eccode",         limit: 40
    t.string   "ssid",           limit: 20
    t.string   "ecname",         limit: 64
    t.string   "linkman",        limit: 64
    t.string   "linkmantel",     limit: 64
    t.integer  "status",         limit: 4
    t.string   "userattr",       limit: 500
    t.string   "timeseg",        limit: 200
    t.integer  "dailyuse",       limit: 4
    t.integer  "zoneflag",       limit: 4
    t.integer  "uservalidity",   limit: 4
    t.integer  "teppwdvalidity", limit: 4
    t.integer  "openflag",       limit: 4
    t.datetime "opendate"
    t.string   "openoperator",   limit: 40
    t.datetime "moddate"
    t.string   "modoperator",    limit: 40
    t.string   "logopath",       limit: 80
    t.integer  "reserved1",      limit: 4
    t.integer  "reserved2",      limit: 4
    t.string   "reserved3",      limit: 40
    t.string   "reserved4",      limit: 40
    t.string   "reserved5",      limit: 40
    t.string   "reserved6",      limit: 40
    t.string   "reserved7",      limit: 80
    t.string   "reserved8",      limit: 80
    t.string   "reserved9",      limit: 255
    t.string   "reserved10",     limit: 255
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "wx_menus", force: :cascade do |t|
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

  create_table "wx_msg_stat_hours", force: :cascade do |t|
    t.integer "wx_official_account_id", limit: 4
    t.date    "date"
    t.string  "hour",                   limit: 255
    t.integer "source",                 limit: 4
    t.integer "msg_type",               limit: 4
    t.integer "user",                   limit: 4
    t.integer "count",                  limit: 4
  end

  create_table "wx_msg_stats", force: :cascade do |t|
    t.integer "wx_official_account_id", limit: 4
    t.integer "cycle",                  limit: 4
    t.date    "date"
    t.integer "source",                 limit: 4
    t.integer "msg_type",               limit: 4
    t.integer "user",                   limit: 4
    t.integer "count",                  limit: 4
  end

  create_table "wx_msgdist_stats", force: :cascade do |t|
    t.integer "wx_official_account_id", limit: 4
    t.integer "cycle",                  limit: 4
    t.date    "date"
    t.integer "source",                 limit: 4
    t.integer "count_interval",         limit: 4
    t.integer "user",                   limit: 4
  end

  create_table "wx_official_accounts", force: :cascade do |t|
    t.string   "original_id",              limit: 255
    t.string   "wechat_name",              limit: 255
    t.string   "wechat_account",           limit: 255
    t.integer  "wechat_type",              limit: 4
    t.string   "app_id",                   limit: 255
    t.string   "app_secret",               limit: 255
    t.string   "access_token",             limit: 255
    t.string   "encoding_aes_key",         limit: 255
    t.integer  "accesstype",               limit: 4
    t.string   "weixin_secret_key",        limit: 255
    t.string   "weixin_token",             limit: 255
    t.integer  "resource_flag",            limit: 4
    t.integer  "wx_m_enterpriseclient_id", limit: 4
    t.integer  "reserved2",                limit: 4
    t.string   "reserved3",                limit: 40
    t.string   "reserved4",                limit: 40
    t.string   "reserved5",                limit: 40
    t.string   "reserved6",                limit: 40
    t.string   "reserved7",                limit: 80
    t.string   "reserved8",                limit: 80
    t.string   "reserved9",                limit: 255
    t.string   "reserved10",               limit: 255
    t.datetime "expired_at"
  end

  add_index "wx_official_accounts", ["weixin_secret_key"], name: "index_wx_official_accounts_on_weixin_secret_key", using: :btree
  add_index "wx_official_accounts", ["weixin_token"], name: "index_wx_official_accounts_on_weixin_token", using: :btree

  create_table "wx_provinces", force: :cascade do |t|
    t.integer "wx_country_id", limit: 4
    t.string  "province_name", limit: 255
    t.integer "province_code", limit: 4
  end

  create_table "wx_resource_groups", force: :cascade do |t|
    t.string  "name",                   limit: 255, null: false
    t.integer "wx_official_account_id", limit: 4,   null: false
  end

  create_table "wx_resources", force: :cascade do |t|
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

  create_table "wx_response_contents", force: :cascade do |t|
    t.integer  "wx_key_response_id", limit: 4
    t.string   "text_content",       limit: 255
    t.string   "media_content",      limit: 255
    t.integer  "content_type",       limit: 4
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

  create_table "wx_user_groups", force: :cascade do |t|
    t.integer  "groupid",                limit: 4,  default: 0, null: false
    t.string   "name",                   limit: 12
    t.integer  "count",                  limit: 4,  default: 0
    t.integer  "wx_official_account_id", limit: 4,  default: 0, null: false
    t.datetime "create_time",                                   null: false
  end

  create_table "wx_user_stats", force: :cascade do |t|
    t.integer  "wx_official_account_id", limit: 4
    t.date     "date"
    t.integer  "user_source",            limit: 4
    t.integer  "new_user",               limit: 4
    t.integer  "cancel_user",            limit: 4
    t.integer  "cumulate_user",          limit: 4
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
  end

  create_table "wx_users", force: :cascade do |t|
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
    t.string  "tagid_list",             limit: 255
  end

  add_index "wx_users", ["nickname"], name: "index_wx_users_on_nickname", using: :btree
  add_index "wx_users", ["wx_official_account_id"], name: "index_wx_users_on_wx_official_account_id", using: :btree

end
