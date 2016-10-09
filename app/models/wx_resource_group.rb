class WxResourceGroup < ActiveRecord::Base
  belongs_to :wx_official_account

  def self.clear(wx_official_account_id)
    delete_all(wx_official_account_id: wx_official_account_id)
  end
end
