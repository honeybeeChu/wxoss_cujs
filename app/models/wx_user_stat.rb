class WxUserStat < ActiveRecord::Base
  def self.summary_data_pull(wx_official_account, url)
    date = (Time.now - 1.day).strftime('%Y-%m-%d')
    result = wx_official_account.wx_post(url, {'begin_date': date, 'end_date': date})
    if result.is_ok?
      result.result[:list].each do |item|
        wx_summary = WxUserStat.new(wx_official_account_id: wx_official_account.id,
                                      date: item[:ref_date],
                                      user_source: item[:user_source],
                                      new_user: item[:new_user],
                                      cancel_user: item[:cancel_user],
                                      cumulate_user: 0)
        wx_summary.save
      end
    end
  end

  def self.cumulate_data_pull(wx_official_account, url)
    date = (Time.now - 1.day).strftime('%Y-%m-%d')
    result = wx_official_account.wx_post(url, {'begin_date': date, 'end_date': date})
    if result.is_ok?
      result.result[:list].each do |item|
        wx_cumulate = WxUserStat.where(:wx_official_account_id => wx_official_account.id, :date => item[:ref_date], :user_source => item[:user_source])
        if wx_cumulate.empty?
          wx_cumulate = WxUserStat.new(wx_official_account_id: wx_official_account.id,
                                       date: item[:ref_date],
                                       user_source: item[:user_source],
                                       new_user: 0,
                                       cancel_user: 0,
                                       cumulate_user: item[:cumulate_user])
          wx_cumulate.save
        else
          wx_cumulate.update_all(cumulate_user: item[:cumulate_user])
        end
      end
    end
  end

  def self.total_data(wx_official_account)
    date = (Time.now - 1.day).strftime('%Y-%m-%d')
    cancel_user,cumulate_user,new_user = 0,0,0
    result = WxUserStat.where(:wx_official_account_id => wx_official_account.id, :date => date)
    result.each do |item|
      new_user += item.new_user
      cancel_user += item.cancel_user
      cumulate_user += item.cumulate_user
    end
    wx_total = WxUserStat.new(wx_official_account_id: wx_official_account.id,
                              date: date,
                              user_source: 99999999,
                              new_user: new_user,
                              cancel_user: cancel_user,
                              cumulate_user: cumulate_user)
    wx_total.save
  end
end
