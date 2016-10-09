class WxProvince < ActiveRecord::Base
  belongs_to :wx_country
  has_many :wx_cities
end
