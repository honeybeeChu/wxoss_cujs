class WxMsgStatJob < ActiveJob::Base
  queue_as :default

  def perform(*args)
    wx_official_accounts = WxOfficialAccount.all
    wx_official_accounts.each do |wx_official_account|
      WxMsgStat.wx_data_pull(wx_official_account, DAY_MSG, 1)
      WxMsgStat.wx_data_pull(wx_official_account, WEEK_MSG, 2)
      WxMsgStat.wx_data_pull(wx_official_account, MONTH_MSG, 3)
    end
  end
end
