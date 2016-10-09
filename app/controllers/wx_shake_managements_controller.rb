class WxShakeManagementsController < WeixinClientController
  layout 'application'
  before_action :set_wx_activity, only: [:show, :edit, :update, :destroy]

  def index
    unless @current_wx_official_account.nil?
      @wx_activities = WxActivity.where(activity_type: 1, wx_official_account_id: @current_wx_official_account.id)
      @wx_activities.each do |wx_activity|
        # -1代表活动未开始，0代表活动已开始，1代表活动进行中，99代表活动已结束
        nowtime = Time.now.strftime("%Y-%m-%d %H:%M:%S")
        begintime = wx_activity.begintime.strftime("%Y-%m-%d %H:%M:%S")
        endtime = wx_activity.endtime.strftime("%Y-%m-%d %H:%M:%S")
        if nowtime < begintime
          wx_activity.update(status: -1)
        end
        if nowtime >= begintime && nowtime <= endtime && wx_activity.status == -1
          wx_activity.update(status: 0)
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
    wx_activity = WxActivity.new(shake_activity_params)
    wx_activity.activity_type = 1 #1代表摇一摇
    wx_activity.status = -1
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
      imgurl = val['imgurl']
      wx_activity_award = WxActivityAward.new(wx_activity_id: wx_activity.id, level: level, name: name, imgurl: imgurl, amount: amount)
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
    if @wx_activity.update(shake_activity_params)
      activity_flag = true
    end
    if @wx_activity_awards.length == params[:award_list].length
      @wx_activity_awards.each do |wx_activity_award|
        params[:award_list].each_pair do |key, val|
          if wx_activity_award.level == val['level'].to_i
            name = val['name']
            amount = val['amount']
            imgurl = val['imgurl']
            if wx_activity_award.update(name: name, imgurl: imgurl, amount: amount)
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
        imgurl = val['imgurl']
        wx_activity_award = WxActivityAward.new(wx_activity_id: @wx_activity.id, level: level, name: name, imgurl: imgurl, amount: amount)
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
    @wx_activity_awards = WxActivityAward.where(wx_activity_id: params[:format])
    @prize_list = Array.new
    wx_activity_users = WxActivityUser.where('wx_activity_id = '+params[:format]+' and award_level is not null').order("award_level ASC")
    wx_activity_users.each do |wx_activity_user|
      data_tmp = Hash.new
      data_tmp[:award_level] = wx_activity_user.award_level
      wx_user = WxUser.where(openid: wx_activity_user.openid).select('nickname')
      data_tmp[:nickname] = wx_user[0].nickname
      @prize_list.push(data_tmp)
    end
    render 'wx_shake_managements/prizelist'
  end

  def uploadpic
    wx_resource = WxResource.new(wx_official_account_id: @current_wx_official_account.id)
    wx_resource.setFile = params[:file]
    wx_resource.set_file_url
    wx_resource.upload
    render :json => {:content => wx_resource.file_url, :type => 'image'}, status => " 200 ok "
  end

  def deletepic
    disk_file = "#{Rails.root}/public#{params[:file_url]}"
    File.delete(disk_file) if File.exist?(disk_file)
    render :json => {:result => "success" }, status => " 200 ok "
  end

  private
  def set_wx_activity
    @wx_activity = WxActivity.find(params[:id])
    @wx_activity_awards = WxActivityAward.where(wx_activity_id: @wx_activity.id)
  end

  def shake_activity_params
    wx_shake_params = Hash.new
    wx_shake_params[:name] = params[:name]
    wx_shake_params[:begintime] = params[:begintime]
    wx_shake_params[:endtime] = params[:endtime]
    wx_shake_params[:maxcount] = params[:maxcount]
    wx_shake_params[:qrcode_url] = params[:qrcode_url]
    wx_shake_params[:description] = params[:description]
    return wx_shake_params
  end
end
