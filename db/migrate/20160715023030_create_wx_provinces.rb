class CreateWxProvinces < ActiveRecord::Migration
  def change
    create_table :wx_provinces do |t|
      t.integer "wx_country_id", limit: 4
      t.string  "province_name", limit: 255
      t.integer "province_code", limit: 4
    end
  end
end
