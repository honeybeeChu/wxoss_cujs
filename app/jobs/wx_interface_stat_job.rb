class WxInterfaceStatJob < ActiveJob::Base
  queue_as :default

  def perform(*args)
    wx_official_accounts = WxOfficialAccount.all
    wx_official_accounts.each do |wx_official_account|
      WxInterfaceStat.wx_data_pull(wx_official_account, INTERFACE_SUM)
      WxInterfaceStatHour.wx_data_pull(wx_official_account, INTERFACE_SUM_HOUR)
    end
  end
end
