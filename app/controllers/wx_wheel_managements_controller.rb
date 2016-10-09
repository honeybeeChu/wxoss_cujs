class WxWheelManagementsController < WeixinClientController
  layout 'application'
  before_action :set_wx_activity, only: [:show, :edit, :update, :destroy]

  def index
    unless @current_wx_official_account.nil?
      @wx_activities = WxActivity.where(activity_type: 2, wx_official_account_id: @current_wx_official_account.id)
      @wx_activities.each do |wx_activity|
        # -1代表活动未开始，1代表活动进行中，99代表活动已结束
        nowtime = Time.now.strftime("%Y-%m-%d %H:%M:%S")
        begintime = wx_activity.begintime.strftime("%Y-%m-%d %H:%M:%S")
        endtime = wx_activity.endtime.strftime("%Y-%m-%d %H:%M:%S")
        if nowtime < begintime
          wx_activity.update(status: -1)
        end
        if nowtime >= begintime && nowtime <= endtime
          wx_activity.update(status: 1)
        end
        if nowtime > endtime
          wx_activity.update(status: 99)
        end
      end
    end
  end

  def show
  end

  def new
    @wx_activity = WxActivity.new
  end

  def edit
  end

  def create
    wx_activity = WxActivity.new(wheel_activity_params)
    wx_activity.activity_type = 2  #2代表大转盘
    wx_activity.wx_official_account_id = @current_wx_official_account.id
    activity_flag = false
    activity_award_flag = false
    if wx_activity.save
      activity_flag = true
    end
    params[:award_list].each_pair do |key, val|
      level = val['level']
      name = val['name']
      amount = val['amount']
      probability = val['probability']
      imgurl = val['imgurl']
      wx_activity_award = WxActivityAward.new(wx_activity_id: wx_activity.id, level: level, name: name, imgurl: imgurl, amount: amount, probability: probability)
      if wx_activity_award.save
        activity_award_flag = true
      end
    end
    if activity_flag && activity_award_flag
      render json: {"result" => "success"}
    else
      render json: {"result" => "false"}
    end
  end

  def update
    activity_flag = false
    activity_award_flag = false
    if @wx_activity.update(wheel_activity_params)
      activity_flag = true
    end
    if @wx_activity_awards.length == params[:award_list].length
      @wx_activity_awards.each do |wx_activity_award|
        params[:award_list].each_pair do |key, val|
          if wx_activity_award.level == val['level'].to_i
            name = val['name']
            amount = val['amount']
            probability = val['probability']
            imgurl = val['imgurl']
            if wx_activity_award.update(name: name, imgurl: imgurl, amount: amount, probability: probability)
              activity_award_flag = true
            end
          end
        end
      end
    else
      @wx_activity_awards.each do |wx_activity_award|
        wx_activity_award.destroy
      end
      params[:award_list].each_pair do |key, val|
        level = val['level']
        name = val['name']
        amount = val['amount']
        probability = val['probability']
        imgurl = val['imgurl']
        wx_activity_award = WxActivityAward.new(wx_activity_id: @wx_activity.id, level: level, name: name, imgurl: imgurl, amount: amount, probability: probability)
        if wx_activity_award.save
          activity_award_flag = true
        end
      end
    end
    if activity_flag && activity_award_flag
      render json: {"result" => "success"}
    else
      render json: {"result" => "false"}
    end
  end

  def destroy
    @wx_activity.destroy
    @wx_activity_awards.destroy_all
    wx_activity_users = WxActivityUser.where(wx_activity_id: params[:id])
    wx_activity_users.destroy_all
    respond_to do |format|
      format.html { render :text => '' }
      format.json { head :no_content }
    end
  end

  def prizelist
    @prize_list = Array.new
    wx_activity_users = WxActivityUser.where('wx_activity_id = '+params[:format]+' and award_level is not null').order("award_level ASC")
    wx_activity_users.each do |user|
      temp = Hash.new
      wx_activity_award = WxActivityAward.where(wx_activity_id: params[:format], level: user.award_level).select('name')
      temp['award_name'] = wx_activity_award[0].name
      wx_user = WxUser.where(openid: user.openid).select('nickname')
      temp['nickname'] = wx_user[0].nickname
      temp['realname'] = user.realname
      temp['telephone'] = user.telephone
      temp['address'] = user.address
      @prize_list.push(temp)
    end
    render 'wx_wheel_managements/prizelist'
  end

  private
  def set_wx_activity
    @wx_activity = WxActivity.find(params[:id])
    @wx_activity_awards = WxActivityAward.where(wx_activity_id: @wx_activity.id)
  end

  def wheel_activity_params
    wx_wheel_params = Hash.new
    wx_wheel_params[:name] = params[:name]
    wx_wheel_params[:begintime] = params[:begintime]
    wx_wheel_params[:endtime] = params[:endtime]
    wx_wheel_params[:description] = params[:description]
    wx_wheel_params[:lottery_num] = params[:lottery_num]
    if(params[:is_repeat_draw] == "true")
      wx_wheel_params[:is_repeat_draw] = 1
    else
      wx_wheel_params[:is_repeat_draw] = 0
    end
    if(params[:receive_way] == "0")
      wx_wheel_params[:receive_way] = 0
    else
      wx_wheel_params[:receive_way] = 1
      wx_wheel_params[:offline_address] = params[:offline_address]
      wx_wheel_params[:offline_description] = params[:offline_description]
    end
    unless params[:receive_info].nil?
      wx_wheel_params[:receive_info] = params[:receive_info]*","
    end
    return wx_wheel_params
  end

end
