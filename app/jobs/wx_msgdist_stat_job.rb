class WxMsgdistStatJob < ActiveJob::Base
  queue_as :default

  def perform(*args)
    wx_official_accounts = WxOfficialAccount.all
    wx_official_accounts.each do |wx_official_account|
      WxMsgdistStat.wx_data_pull(wx_official_account, DAY_MSG_DIST, 1)
      WxMsgdistStat.wx_data_pull(wx_official_account, WEEK_MSG_DIST, 2)
      WxMsgdistStat.wx_data_pull(wx_official_account, MONTH_MSG_DIST, 3)
    end
  end
end
