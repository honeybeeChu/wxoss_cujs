class WxMsgStat < ActiveRecord::Base

  def self.wx_data_pull(wx_official_account, url, cycle)
    date = (Time.now - 1.day).strftime('%Y-%m-%d')
    result = wx_official_account.wx_post(url, {'begin_date': date, 'end_date': date})
    if result.is_ok?
      result.result[:list].each do |msg|
        wx_msg_stat = WxMsgStat.new(wx_official_account_id: wx_official_account.id,
                                    cycle: cycle, date: msg[:ref_date],
                                    source: msg[:user_source], msg_type: msg[:msg_type],
                                    user: msg[:msg_user], count: msg[:msg_count])
        wx_msg_stat.save
      end
    end
  end
end