class CreateWxCountries < ActiveRecord::Migration
  def change
    create_table :wx_countries do |t|
      t.string  "country_name", limit: 255
      t.integer "country_code", limit: 4
    end
  end
end
