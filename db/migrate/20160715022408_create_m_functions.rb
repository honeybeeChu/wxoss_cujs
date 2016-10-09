class CreateMFunctions < ActiveRecord::Migration
  def change
    create_table :m_functions do |t|
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
  end
end
