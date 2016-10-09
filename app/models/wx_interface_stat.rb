class WxInterfaceStat < ActiveRecord::Base
  def self.wx_data_pull(wx_official_account, url)
    date = (Time.now - 1.day).strftime('%Y-%m-%d')
    result = wx_official_account.wx_post(url, {'begin_date': date, 'end_date': date})
    if result.is_ok?
      result.result[:list].each do |item|
        wx_interface_stat = WxInterfaceStat.new(wx_official_account_id: wx_official_account.id,
                                                date: item[:ref_date],
                                                callback_count: item[:callback_count],
                                                fail_count: item[:fail_count],
                                                total_time_cost: item[:total_time_cost],
                                                max_time_cost: item[:max_time_cost])
        wx_interface_stat.save
      end
    end
  end
end
