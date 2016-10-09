class WxMsgdistStat < ActiveRecord::Base
  def self.wx_data_pull(wx_official_account, url, cycle)
    date = (Time.now - 1.day).strftime('%Y-%m-%d')
    result = wx_official_account.wx_post(url, {'begin_date': date, 'end_date': date})
    if result.is_ok?
      result.result[:list].each do |msg|
        wx_msgdist_stat = WxMsgdistStat.new(wx_official_account_id: wx_official_account.id,
                                            date: msg[:ref_date], cycle: cycle, source: msg[:user_source],
                                            count_interval: msg[:count_interval], user: msg[:msg_user])
        wx_msgdist_stat.save
      end
    end
  end
end
