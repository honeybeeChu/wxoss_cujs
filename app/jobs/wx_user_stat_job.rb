class WxUserStatJob < ActiveJob::Base
  queue_as :default

  def perform(*args)
    wx_official_accounts = WxOfficialAccount.all
    wx_official_accounts.each do |wx_official_account|
      WxUserStat.summary_data_pull(wx_official_account, USER_SUMMARY)
      WxUserStat.cumulate_data_pull(wx_official_account, USER_CUMULATE)
      WxUserStat.total_data(wx_official_account)
    end
  end
end