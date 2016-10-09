class WxResourcesController < WeixinClientController
  layout 'wx_application'
  before_action :set_wx_resource, only: [:rename]

  # GET /wx_resources
  # GET /wx_resources.json
  def index
    begin_count = params[:begin].to_i
    if begin_count < 0
      begin_count = 0
    end
    result = WxResource.where("wx_official_account_id =? and resource_type =? and wx_resource_group_id =? and deleted =0", @current_wx_official_account.id, params[:type], params[:group_id]||1).order(created_at: :desc)
                 .limit(params[:count]).offset(begin_count)
    total = WxResource.where("wx_official_account_id =? and resource_type =? and wx_resource_group_id =? and deleted =0", @current_wx_official_account.id, params[:type], params[:group_id]||1).count
    file_item = []
    result.each do |wx_resource|
      temp = Hash.new
      temp[:file_id] = wx_resource.id
      temp[:name] = wx_resource.resource_name
      temp[:type] = wx_resource.resource_type
      temp[:size] = wx_resource.resource_size
      temp[:update_time] = wx_resource.updated_at
      temp[:cdn_url] = wx_resource.file_url
      temp[:img_format] = wx_resource.fomat
      temp[:video_cdn_id] = ''
      temp[:video_thumb_cdn_url] =''
      temp[:seq] =''
      file_item << temp
    end
    page = Hash.new
    page[:type] = params[:type]
    file_cnt = Hash.new
    file_cnt[:total] = total
    file_cnt[:img_cnt] = total
    file_cnt[:voice_cnt] = 0
    file_cnt[:video_cnt] = 0
    file_cnt[:app_msg_cnt] = 0
    file_cnt[:commondity_msg_cnt] = 0
    file_cnt[:video_msg_cnt] = 0
    file_cnt[:short_video_cnt] = 0
    file_cnt[:app_msg_sent_cnt] = 0
    page[:file_cnt] = file_cnt
    page[:file_item] = file_item
    file_group_list = Hash.new
    file_group_list[:biz_uin] = "3240112196"
    file_group = []
    file_group << {'id': 1, 'name': '未分组', 'files': [], 'count': WxResource.where("wx_official_account_id =? and resource_type =? and wx_resource_group_id = 1 and deleted =0", @current_wx_official_account.id, params[:type]).count}
    WxResourceGroup.where("wx_official_account_id =?", @current_wx_official_account.id).each do |wx_resource_group|
      temp = Hash.new
      temp[:id] = wx_resource_group.id
      temp[:name] = wx_resource_group.name
      temp[:files] = []
      temp[:count] = WxResource.where("wx_official_account_id =? and resource_type =? and wx_resource_group_id =?", @current_wx_official_account.id, params[:type], wx_resource_group.id).count
      file_group << temp
    end
    file_group_list[:file_group] = file_group

    page[:file_group_list] = file_group_list
    page[:watermark_status] = 2

    @wx_resources = Hash.new
    @wx_resources[:page] = page
    @wx_resources[:fakeid] = 3240112196
    @wx_resources[:groupid] = params[:group_id] ||1
    @wx_resources[:begin] = begin_count
    @wx_resources[:count] = params[:count]
    @wx_resources[:nickName] = @current_wx_official_account.wechat_name
    @page_css = 'page_media_list'
    respond_to do |format|
      format.html {
        case params[:type]
          when '2'
            render 'image'
          when '3'
            render 'video'
          else
            render 'audio'
        end
      }
      format.json {
        render :json => {:base_resp => suc_msg, :page_info => page}, status => "200 ok"
      }
    end
  end

  def create
    @wx_resource = WxResource.new(wx_resource_group_id: params[:groupid]||1, wx_official_account_id: @current_wx_official_account.id)
    @wx_resource.setFile= params[:file]
    @wx_resource.set_file_url
    if (params[:type].include? 'image')
      @wx_resource.resource_type = 2
    end
    if @wx_resource.save
      params = %W(#{ADD_MATERIAL} #{"type=image&access_token=#{@current_wx_official_account.client.get_access_token}"})
      post_url = params.join('?')
      curl_base_path = Utils::Os.get_curl_base_path
      command = " #{curl_base_path}curl -k ".concat(" \"#{post_url}\" ").concat("-F media=@").concat(@wx_resource.disk_file)
      IO.popen(command) { |f|
        result = JSON.parse(f.gets)
        @wx_resource.update(:media_id => result['media_id'], :wx_url => result['url'])
      }
      render :json => {:base_resp => suc_msg, :file_id => @wx_resource.id, :content => @wx_resource.file_url, :type => ' image '}, status => " 200 ok "
    end
  end

  def getimgdata
    unless params[:fileId].blank?
      image = File.new(WxResource.find(params[:fileId]).disk_file, 'rb').read
      send_data(image)
    end
  end

  def create_group
    wx_resource_group = WxResourceGroup.new(:name => params[:name], :wx_official_account_id => @current_wx_official_account.id)
    if wx_resource_group.save
      render :json => {:base_resp => suc_msg}, status => :created
    end
  end

  def modify_group
    wx_resource_group = WxResourceGroup.find(params[:id])
    if wx_resource_group.update(:name => params[:name])
      render :json => {:base_resp => suc_msg}, status => :created
    end
  end

  def del_group
    WxResourceGroup.destroy(params[:id])
    WxResource.where(:wx_resource_group_id => params[:id]).update_all(:wx_resource_group_id => 1)
    render :json => {:base_resp => suc_msg}, status => :created
  end

  def modify_img_group
    WxResource.find(params[:file_id].split(',')).each do |wx_resource|
      wx_resource.update(:wx_resource_group_id => params[:new_group_id])
    end
    render :json => {:base_resp => suc_msg}, status => :created
  end

  def rename
    @wx_resource = WxResource.find(params[:fileid])
    if @wx_resource.update(:resource_name => params[:fileName])
      render :json => {:base_resp => suc_msg}, status => :created
    end
  end

  def destroy
    ret, using_img_cnt= WxResource.destroy_batch(params[:fileid].split(','))
    render :json => {:base_resp => suc_msg(ret), :using_img_cnt => using_img_cnt}, status => :created
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_wx_resource
    @wx_resource = WxResource.find(params[:fileid])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def wx_resource_params
    params.permit(:file, :resource_type, :type, :wx_resource_ids, :resource_name)
  end

  def suc_msg(ret=0)
    base_resp = Hash.new
    base_resp[:err_msg] = 'ok'
    base_resp[:ret] = ret
    return base_resp
  end
end
