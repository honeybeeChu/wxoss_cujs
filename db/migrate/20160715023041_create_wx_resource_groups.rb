class CreateWxResourceGroups < ActiveRecord::Migration
  def change
    create_table :wx_resource_groups do |t|
      t.string  "name",                   limit: 255, null: false
      t.integer "wx_official_account_id", limit: 4,   null: false
    end
  end
end
