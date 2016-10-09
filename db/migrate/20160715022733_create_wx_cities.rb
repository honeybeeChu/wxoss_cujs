class CreateWxCities < ActiveRecord::Migration
  def change
    create_table :wx_cities do |t|
      t.integer "wx_country_id",  limit: 4
      t.integer "wx_province_id", limit: 4
      t.string  "city_name",      limit: 255
      t.integer "city_code",      limit: 4
    end
  end
end
