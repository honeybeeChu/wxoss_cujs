require 'net/https'
require 'uri'
class WxWheelActivitiesController < ApplicationController
  skip_before_filter :authenticate, :url_check
  before_action :set_remain_awards, only: [:redirect, :wheel]

  def index
    wx_activity_id = params[:wx_activity_id]
    wx_official_account_id = WxActivity.find(wx_activity_id).wx_official_account_id
    app_id = WxOfficialAccount.find(wx_official_account_id).app_id
    redirect_uri = url_encode(WEIXIN_SERVER+'/wx_wheel_activities/redirect?wx_activity_id='+wx_activity_id+'')
    code_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+app_id+'&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
    redirect_to code_url
  end

  def redirect
    code = params[:code]
    wx_activity_id = params[:wx_activity_id]
    wx_official_account_id = WxActivity.find(wx_activity_id).wx_official_account_id
    app_id = WxOfficialAccount.find(wx_official_account_id).app_id
    app_secret = WxOfficialAccount.find(wx_official_account_id).app_secret
    url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+app_id+'&secret='+app_secret+'&code='+code+'&grant_type=authorization_code'
    data = post(url)
    if data['errcode'].nil?
      @openid = data['openid']
      @wx_activity = WxActivity.find(wx_activity_id)
      nowtime = Time.now
      expiretime = Time.local(nowtime.year, nowtime.month, nowtime.day, 23, 59, 59)
      key = "lottery_num:"+wx_activity_id+":"+@openid
      unless weixin_redis.exists(key)
        weixin_redis.set(key, @wx_activity.lottery_num)
        if @wx_activity.is_repeat_draw
          weixin_redis.expireat(key, expiretime.to_i)
        end
      end
      @lottery_num = weixin_redis.get(key)
    end
    render 'wx_wheel_activities/index'
  end

  def wheel
    prize_hash = Hash.new
    win_rate = 0
    prize_hash[0] = {'id'=>0,'prize'=>'谢谢参与'}
    @remain_award_list.each do |award|
      temp = Hash.new
      temp['id'] = award[:level]
      temp['prize'] = award[:name]
      temp['n'] = award[:amount]
      if award[:amount] == 0
        temp['v'] = 0
      else
        temp['v'] = award[:probability]
      end
      win_rate += temp['v']
      prize_hash[award[:level]] = temp
    end
    prize_hash[0]['v'] = 100-win_rate
    arr = Hash.new
    prize_hash.each_pair do |key, val|
      arr[val['id']] = val['v']
    end
    rid = get_rand(arr) #根据概率获取奖项id
    res = prize_hash[rid] #抽中的奖项
    # 抽奖次数递减
    key = "lottery_num:"+params[:wx_activity_id]+":"+params[:openid]
    unless weixin_redis.get(key).nil?
      weixin_redis.decr(key)
    end
    result = Hash.new
    result[:id] = res['id']
    result[:prize] = res['prize']
    render :json => {"result"  =>  result}
  end

  def update_info
    wx_wheel_params = Hash.new
    wx_wheel_params[:wx_activity_id] = params[:wx_activity_id]
    wx_wheel_params[:openid] = params[:openid]
    wx_wheel_params[:award_level] = params[:award_level]
    wx_wheel_params[:realname] = params[:realname]
    wx_wheel_params[:telephone] = params[:telephone]
    wx_wheel_params[:address] = params[:address]
    wx_activity_user = WxActivityUser.new(wx_wheel_params)
    if wx_activity_user.save
      render json: {"result" => "success"}
    else
      render json: {"result" => "false"}
    end
  end

  def query_record
    award_info = Hash.new
    award_info[:is_award] = false
    award_info[:award_list] = Array.new
    wx_activity_user = WxActivityUser.where(wx_activity_id: params[:wx_activity_id], openid: params[:openid])
    unless wx_activity_user.empty?
      wx_activity_user.each do |user|
        temp = Hash.new
        temp[:level] = user.award_level.to_i
        temp[:time] = user.updated_at.strftime('%Y-%m-%d %H:%M:%S') unless user.updated_at.nil?
        if temp[:level] > 0
          award_info[:is_award] = true
          wx_activity_award = WxActivityAward.where(wx_activity_id: params[:wx_activity_id], level: temp[:level])
          temp[:name] = wx_activity_award[0].name
          award_info[:award_list].push(temp)
        end
      end
    end
    render json: {"result" => "success", "award_info" => award_info }
  end

  private
  def set_remain_awards
    wx_activity_awards =  WxActivityAward.where(wx_activity_id: params[:wx_activity_id])
    @remain_award_list = Array.new
    wx_activity_awards.each do |wx_activity_award|
      temp = Hash.new
      temp[:level] = wx_activity_award.level
      temp[:name] = wx_activity_award.name
      temp[:imgurl] = wx_activity_award.imgurl
      wx_activity_user = WxActivityUser.where(wx_activity_id: params[:wx_activity_id], award_level: wx_activity_award.level)
      temp[:amount] = wx_activity_award.amount - wx_activity_user.length
      temp[:probability] = wx_activity_award.probability
      @remain_award_list.push(temp)
    end
  end

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

  # 根据概率获取奖项
  def get_rand(pro_hash)
    result = nil
    #概率数组的总概率精度
    pro_sum = pro_hash.values.inject{|sum,x| sum + x }
    #概率数组循环
    pro_hash.each_pair do |key, pro_cur|
      rand_num = 1 + rand(pro_sum)
      if rand_num <= pro_cur
        result = key
        break
      else
        pro_sum -= pro_cur
      end
    end
    result
  end

  def weixin_redis
    WeixinAuthorize.weixin_redis
  end
end
