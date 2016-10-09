class CreateMMenuTrees < ActiveRecord::Migration
  def change
    create_table :m_menu_trees do |t|
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
  end
end
