class CreateMFunctionUrlFilter < ActiveRecord::Migration
  def change
    create_table :m_function_url_filters do |t|
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
  end
end
