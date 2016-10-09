require 'net/https'
require 'uri'
class WxShakeActivitiesController < ApplicationController
  skip_before_filter :authenticate, :url_check

  def index
    wx_activity_id = params[:wx_activity_id]
    wx_official_account_id = WxActivity.find(wx_activity_id).wx_official_account_id
    app_id = WxOfficialAccount.find(wx_official_account_id).app_id
    redirect_uri = url_encode(WEIXIN_SERVER+'/wx_shake_activities/redirect?wx_activity_id='+wx_activity_id+'')
    code_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+app_id+'&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
    redirect_to code_url
  end

  def redirect
    code = params[:code]
    wx_activity_id = params[:wx_activity_id]
    @wx_activity = WxActivity.find(wx_activity_id)
    wx_official_account_id = WxActivity.find(wx_activity_id).wx_official_account_id
    app_id = WxOfficialAccount.find(wx_official_account_id).app_id
    app_secret = WxOfficialAccount.find(wx_official_account_id).app_secret
    url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+app_id+'&secret='+app_secret+'&code='+code+'&grant_type=authorization_code'
    data = post(url)
    if data['errcode'].nil?
      @openid = data['openid']
      unless WxActivityUser.exists?(wx_activity_id: wx_activity_id, openid: @openid)
        wx_activity_newuser = WxActivityUser.new(wx_activity_id: wx_activity_id, openid: @openid)
        wx_activity_newuser.save
      end
    end
    render 'wx_shake_activities/shake'
  end

  def screenshow
    @wx_activity = WxActivity.find(params[:format])
    render 'wx_shake_activities/activity'
  end

  def runway
    @wx_activity = WxActivity.find(params[:wx_activity_id])
    render 'wx_shake_activities/runway'
  end

  def get_userdata
    data_list = Array.new
    wx_activity_users = WxActivityUser.where(wx_activity_id: params[:wx_activity_id]).order("shake_count DESC").limit(8)
    wx_activity_users.each do |wx_activity_user|
      data_tmp = Hash.new
      data_tmp[:id] = wx_activity_user.id
      data_tmp[:wx_activity_id] = wx_activity_user.wx_activity_id
      data_tmp[:openid] = wx_activity_user.openid
      data_tmp[:count] = wx_activity_user.shake_count
      wx_user = WxUser.where(openid: wx_activity_user.openid)
      data_tmp[:nickname] = wx_user[0].nickname
      data_tmp[:headimgurl] = wx_user[0].headimgurl
      data_list << data_tmp
    end
    render json: {"result" => "success", "data_list" => data_list}
  end

  def awardlist
    wx_activity_id = params[:wx_activity_id]
    total_amount = 0
    for index in 1..5
      amount = WxActivityAward.where(wx_activity_id: wx_activity_id, level: index).sum(:amount)
      if amount != 0
        total_amount += amount
        wx_activity_users = WxActivityUser.where(wx_activity_id: wx_activity_id).order("shake_count DESC").limit(amount).offset(total_amount-amount)
        wx_activity_users.each do |wx_activity_user|
          wx_activity_user.update(award_level: index)
        end
      end
    end
    @data_list = Array.new
    sum = WxActivityAward.where(wx_activity_id: wx_activity_id).sum(:amount)
    wx_activity_users = WxActivityUser.where(wx_activity_id: wx_activity_id).order("shake_count DESC").limit(sum)
    wx_activity_users.each do |wx_activity_user|
      data_tmp = Hash.new
      data_tmp[:wx_activity_id] = wx_activity_user.wx_activity_id
      data_tmp[:award_level] = wx_activity_user.award_level
      wx_user = WxUser.where(openid: wx_activity_user.openid)
      data_tmp[:nickname] = wx_user[0].nickname
      @data_list << data_tmp
    end
    render 'wx_shake_activities/awardlist'
  end

  def update_status
    wx_activity = WxActivity.find(params[:wx_activity_id] )
    wx_activity_user = WxActivityUser.where(wx_activity_id: params[:wx_activity_id])
    if params[:status] == "start"
      if wx_activity.update(status: 1) && wx_activity_user.update_all(award_level: 0, shake_count: 0)
        render json: {"result" => "success"}
      end
    end
    if params[:status] == "gameover"
      if wx_activity.update(status: 99)
        render json: {"result" => "success"}
      end
    end
    if params[:status] == "reset"
      if wx_activity.update(status: 0) && wx_activity_user.update_all(award_level: 0, shake_count: 0)
        render json: {"result" => "success"}
      end
    end
  end

  def get_status
    status = WxActivity.find(params[:wx_activity_id]).status
    render json: {"result" => "success", "status" => status}
  end

  def save_count
    maxcount = WxActivity.find(params[:wx_activity_id]).maxcount
    wx_activity_user = WxActivityUser.where(wx_activity_id: params[:wx_activity_id], openid:params[:openid])
    if params[:count].to_i > maxcount
      render json: {"result" => "false"}
    else
      if wx_activity_user.update_all(shake_count: params[:count])
        render json: {"result" => "success"}
      end
    end
  end

  def get_awardstatus
    award_info = Hash.new
    award_info[:is_award] = false
    wx_activity_user = WxActivityUser.where(wx_activity_id: params[:wx_activity_id], openid: params[:openid])
    award_level = wx_activity_user[0].award_level.to_i
    if award_level > 0
      award_info[:is_award] = true
      wx_activity_award = WxActivityAward.where(wx_activity_id: params[:wx_activity_id], level: award_level)
      award_info[:name] = wx_activity_award[0].name
    end
    render json: {"result" => "success", "award_info" => award_info }
  end

  private
  def url_encode(str)
    str.to_s.gsub(/[^a-zA-Z0-9_\-.]/n){ sprintf("%%%02X", $&.unpack("C")[0]) }
  end

  def post(url)
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true if uri.scheme == "https"
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Get.new(uri.request_uri)
    response = http.request(request)
    return JSON.parse(response.body)
  end

end