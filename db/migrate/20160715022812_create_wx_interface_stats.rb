class CreateWxInterfaceStats < ActiveRecord::Migration
  def change
    create_table :wx_interface_stats do |t|
      t.integer "wx_official_account_id", limit: 4
      t.date    "date"
      t.integer "callback_count",         limit: 4
      t.integer "fail_count",             limit: 4
      t.integer "total_time_cost",        limit: 4
      t.integer "max_time_cost",          limit: 4
    end
  end
end
