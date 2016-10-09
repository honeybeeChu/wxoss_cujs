class WxCountry < ActiveRecord::Base
  has_many :wx_provinces
  has_many :wx_cities
end
