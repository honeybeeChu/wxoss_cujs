class WxKeyResponse < ActiveRecord::Base
  has_many :wx_keys, :dependent => :destroy
  has_many :wx_response_contents, :dependent => :destroy
  belongs_to :wx_official_account
end
