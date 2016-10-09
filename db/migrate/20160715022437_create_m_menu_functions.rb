class CreateMMenuFunctions < ActiveRecord::Migration
  def change
    create_table :m_menu_functions do |t|
      t.string   "funcid",      limit: 255
      t.integer  "systemid",    limit: 4
      t.string   "nodeid",      limit: 255
      t.string   "layout",      limit: 255
      t.string   "bstyle",      limit: 255
      t.text     "description", limit: 65535
      t.datetime "created_at",                null: false
      t.datetime "updated_at",                null: false
    end
  end
end
