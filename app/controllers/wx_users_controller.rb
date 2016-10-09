class WxUsersController < WeixinClientController
  layout 'wx_application'
  before_action :set_wx_user, only: [:get_fans_info, :add_mark]
  before_action :get_users, only: [:get_user_list]

  def index
    unless @current_wx_official_account.blank?
      user_list = Array.new
      get_users.each do |wx_user|
        user_hash = Hash.new
        user_hash[:id] = wx_user.openid
        user_hash[:nick_name] = wx_user.nickname
        user_hash[:remark_name] = wx_user.remark
        user_hash[:create_time] = wx_user.subscribe_time
        user_hash[:headimgurl] = wx_user.headimgurl
        group_arr = Array.new
        group_arr << wx_user.groupid if wx_user.groupid > 0
        user_hash[:group_id] = group_arr
        user_list << user_hash
      end

      @wx_cgiData = Hash.new
      @wx_cgiData[:group_list], @wx_cgiData[:total_user_num] = WxUserGroup.groups(@current_wx_official_account.id, '')
      @wx_cgiData[:user_list] = user_list
    end
    @page_css = 'page_user'
    respond_to do |format|
      format.html {
        render 'wx_users/index'
      }
      format.json {
        render :json => {:base_resp => suc_msg, :page_info => page}
      }
    end
  end

  def get_fans_info
    user_info_list = Array.new
    wx_user_hash = Hash.new
    wx_user_hash[:user_city] = @wx_user.city
    wx_user_hash[:user_country] = @wx_user.country
    wx_user_hash[:user_create_time] = @wx_user.subscribe_time
    wx_user_hash[:user_gender] = @wx_user.sex
    group_arr = Array.new
    group_arr << @wx_user.groupid
    wx_user_hash[:user_group_id] = group_arr
    wx_user_hash[:user_head_img] = @wx_user.headimgurl
    wx_user_hash[:user_msg_cnt] = 0
    wx_user_hash[:user_name] = @wx_user.nickname
    wx_user_hash[:user_openid] = @wx_user.openid
    wx_user_hash[:user_province] = @wx_user.province
    wx_user_hash[:user_remark] = @wx_user.remark
    wx_user_hash[:user_signature] = ''
    user_info_list << wx_user_hash
    user_list = Hash.new
    user_list[:user_info_list] = user_info_list

    group_info = Hash.new
    group_info[:group_info_list], total = WxUserGroup.groups(@current_wx_official_account.id)
    render :json => {:base_resp => suc_msg, :group_info => group_info, :user_list => user_list}
  end

  def get_user_list
    group_info = Hash.new
    group_info[:group_info_list], total = WxUserGroup.groups(@current_wx_official_account.id)
    user_info_list = Array.new
    @wx_users.each do |wx_user|
      wx_user_hash = Hash.new
      wx_user_hash[:user_openid] = wx_user.openid
      group_arr = Array.new
      group_arr << wx_user.groupid if wx_user.groupid > 0
      wx_user_hash[:user_group_id] = group_arr
      wx_user_hash[:user_name] = wx_user.nickname
      wx_user_hash[:user_remark] = wx_user.remark
      wx_user_hash[:user_create_time] = wx_user.subscribe_time
      wx_user_hash[:headimgurl] = wx_user.headimgurl
      user_info_list << wx_user_hash
    end
    user_list = Hash.new
    user_list[:user_info_list] = user_info_list
    render :json => {:group_info => group_info, :user_list => user_list, :base_resp => suc_msg}
  end

  def search
    sql = 'wx_official_account_id =:wx_official_account_id'
    query = Hash.new
    query[:wx_official_account_id] = @current_wx_official_account.id
    unless params[:groupid].blank? || params[:groupid].to_i < 0
      sql.concat(' and groupid =:groupid')
      query[:groupid] = params[:groupid]
    end
    unless params[:query].blank?
      sql.concat(' and nickname like :nickname')
      query[:nickname] = "%#{params[:query]}%"
    end
    wx_users = WxUser.where(sql, query).limit(params[:pagesize]).offset(params[:pageidx].to_i * params[:pagesize].to_i)
    user_info_list = Array.new
    wx_users.each do |wx_user|
      wx_user_hash = Hash.new
      wx_user_hash[:user_openid] = wx_user.openid
      group_arr = Array.new
      group_arr << wx_user.groupid if wx_user.groupid > 0
      wx_user_hash[:user_group_id] = group_arr
      wx_user_hash[:user_name] = wx_user.nickname
      wx_user_hash[:user_remark] = wx_user.remark
      wx_user_hash[:user_create_time] = wx_user.subscribe_time.to_i
      wx_user_hash[:headimgurl] = wx_user.headimgurl
      user_info_list << wx_user_hash
    end
    user_list = Hash.new
    user_list[:user_info_list] = user_info_list
    render :json => {:total_user_num => user_info_list.size, :user_list => user_list, :base_resp => suc_msg}
  end

  def add_mark
    @wx_user.update_remark(@current_wx_official_account, params[:mark_name])
    render :json => {:base_resp => suc_msg}
  end

  def create_group
    add_groupid = WxUserGroup.create_group(@current_wx_official_account, params[:group_name])
    render :json => {:add_groupid => add_groupid, :base_resp => suc_msg}
  end

  def rename_group
    wx_user_group = WxUserGroup.find([params[:groupid], @current_wx_official_account.id])
    wx_user_group.rename_group(@current_wx_official_account, params[:group_name])
    render :json => {:base_resp => suc_msg}
  end

  def del_group
    wx_user_group = WxUserGroup.find([params[:groupid], @current_wx_official_account.id])
    wx_user_group.del_group(@current_wx_official_account)
    render :json => {:base_resp => suc_msg}
  end

  def del_tag
    groupids = params[:groupid_list].split('|')
    WxUser.batch_set_tag(@current_wx_official_account, params[:user_openid].split('|'), groupids[0], DEFAULT_GROUP_ID)
    render :json => {:base_resp => suc_msg}
  end

  def batch_set_tag
    groupids = params[:groupid_list].split('|')
    WxUser.batch_set_tag(@current_wx_official_account, params[:user_openid_list].split('|'), groupids[0])
    render :json => {:base_resp => suc_msg}
  end

  def set_black
    WxUser.batch_set_tag(@current_wx_official_account, params[:user_openid_list].split('|'), BLACK_GROUP_ID)
    render :json => {:base_resp => suc_msg}
  end

  def cancle_black
    WxUser.batch_set_tag(@current_wx_official_account, params[:user_openid_list].split('|'), BLACK_GROUP_ID, DEFAULT_GROUP_ID)
    render :json => {:base_resp => suc_msg}
  end

  def fixgroupcnt
    render :nothing => ''
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_wx_user
    @wx_user = WxUser.where(wx_official_account_id: @current_wx_official_account.id, openid: params[:user_openid]).take
  end

  def get_users
    sql = 'wx_official_account_id =:wx_official_account_id'
    query = Hash.new
    query[:wx_official_account_id] = @current_wx_official_account.id
    unless params[:groupid].blank? || params[:groupid].to_i < 0
      sql.concat(' and groupid =:groupid')
      query[:groupid] = params[:groupid]
    else
      sql.concat(' and groupid != 1')
    end
    order_by = 'subscribe_time desc'
    unless params[:begin_create_time].blank? || params[:begin_create_time].to_i < 0
      if params[:backfoward] == '1'
        sql.concat(' and subscribe_time < :subscribe_time')
      else
        sql.concat(' and subscribe_time > :subscribe_time')
        order_by = 'subscribe_time asc'
      end
      query[:subscribe_time] = params[:begin_create_time].to_i
    end
    @wx_users = WxUser.where(sql, query).limit(params[:limit]||20).offset(params[:offset]).order(order_by)
    if params[:backfoward] == '0'
      @wx_users = @wx_users.reverse
    end
    return @wx_users
  end

  def suc_msg
    base_resp = Hash.new
    base_resp[:err_msg] = 'ok'
    base_resp[:ret] = 0
    return base_resp
  end
end
