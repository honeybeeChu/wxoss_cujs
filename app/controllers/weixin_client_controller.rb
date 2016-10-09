class WeixinClientController < ApplicationController
  layout 'wx_application'
  before_filter :set_wx_official_account
  protected
  def set_wx_official_account
    @account_select = true
    unless session[:current_official_account_id].blank?
      @current_wx_official_account = WxOfficialAccount.find(session[:current_official_account_id])
      unless @matchresult.include? (@current_wx_official_account.wechat_type.to_s)
        @current_wx_official_account = nil
        @authorize_msg = '该公众号未认证，此功能受限，请认证！'
      else
        @account_select = false
      end
    end
  end

  def format_time(time)
    time.strftime('%Y-%m-%d')
  end

  def parse_datetime(time_str)
    Time.strptime(time_str, '%Y-%m-%d')
  end
end
