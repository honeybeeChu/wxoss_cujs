class WxBatchMessagesController < WeixinClientController
  layout 'application'
  def index
    # 返回所有的国家列表
    @all_countries = WxCountry.all
    unless @current_wx_official_account.nil?
      @all_user_groups = @current_wx_official_account.wx_user_groups
      # @wx_articles = @current_wx_official_account.wx_articles
      @wx_articles = @current_wx_official_account.wx_articles.group("news_id").having("media_id is not null and cover_file_id is not null")

      time = Time.new
      _month = time.year.to_s + '-'+ (time.month.to_s.length ==1 ? "0"+time.month.to_s : time.month.to_s)
      @has_send_account = @current_wx_official_account.wx_batch_send_messages.where("create_time like ?","#{_month}%").count

      setImgGroupsDatas
    end


    render :index
  end

  def delete_message
    delete_message = WxBatchSendMessage.find params[:message_id]
    delete_message.is_deleted = 1
    delete_message.save
    render json: {"result" => "ok"}
  end


  # 展现已发送的群发消息
  def batch_messages_history
    @wx_batch_messages = @current_wx_official_account.wx_batch_send_messages.where("is_deleted = 0")
    _client = @current_wx_official_account.client
    render "batch_messages_history"
  end


  # 通过国家ＩＤ获取下面的省份
  def get_provinces_by_country_id
    country_id = params[:country_id]
    @wx_provinces = WxCountry.find(country_id).wx_provinces
    render json: {"result" => @wx_provinces}
  end

  # 通过省份ＩＤ获取下面的城市
  def get_cities_by_province_id
    province_id = params[:province_id]
    wx_cities = WxProvince.find(province_id).wx_cities
    render json: {"result" => wx_cities}
  end


  # 消息的群发功能接口
  def batchSendMessage
    time = Time.new
    _month = time.year.to_s + '-'+ (time.month.to_s.length ==1 ? "0"+time.month.to_s : time.month.to_s)
    has_send_account = @current_wx_official_account.wx_batch_send_messages.where("create_time like ?","#{_month}%").count
    if has_send_account >= 4
      render json: {"result" => "false","errorMsg"=>"本月已经发送满４条，不能再群发消息"}
    else
      select_sentence = ""
      if params[:group] != "all"
        select_sentence = select_sentence + "groupid=" + params[:group]
      end
      if params[:gender] != "all"

        if select_sentence == ""
          select_sentence = select_sentence + "sex=" + params[:gender]
        else
          select_sentence = select_sentence + " and sex=" + params[:gender]
        end
      end
      if params[:country] != "all"
        country_name = WxCountry.find(params[:country]).country_name
        if select_sentence == ""
          select_sentence = select_sentence + "country='" + country_name + "'"
        else
          select_sentence = select_sentence + " and country='" + country_name + "'"
        end

      end
      if params[:province] != "all"
        province_name = WxProvince.find(params[:province]).province_name

        if select_sentence == ""
          select_sentence = select_sentence + "province='" + province_name + "'"
        else
          select_sentence = select_sentence + " and province='" + province_name + "'"
        end

      end
      if params[:city] != "all"
        city_name = WxCity.find(params[:city]).city_name
        if select_sentence == ""
          select_sentence = select_sentence + "city='" + city_name + "'"
        else
          select_sentence = select_sentence + " and city='" + city_name + "'"
        end

      end


      users = @current_wx_official_account.wx_users.where(select_sentence)
      openid_array = Array.new
      users.each do |user|
        openid_array.push user.openid
      end

      _client = @current_wx_official_account.client

      # 图文
      if params[:msg_type] == "0"
        news_media_id = WxArticle.find(params[:msg_content]).media_id
        # __result = _client.mass_preview "oRDAgwQb8Q6Wkgq57ca3GxwAFUcQ",news_media_id
        __result = _client.mass_with_openids openid_array,news_media_id
        # 文字
      elsif params[:msg_type] == "1"
        # __result = _client.mass_preview "oRDAgwQb8Q6Wkgq57ca3GxwAFUcQ",params[:msg_content],"text"
        __result = _client.mass_with_openids openid_array,params[:msg_content],"text"
        # 图片
      elsif params[:msg_type] == "2"
        img_media_id = WxResource.find(params[:msg_content]).media_id
        # __result = _client.mass_preview "oRDAgwQb8Q6Wkgq57ca3GxwAFUcQ",img_media_id,"image"
        __result = _client.mass_with_openids openid_array,img_media_id,"image"
      end



      # 如果发送成功则保存此消息记录
      if __result.code == 0
        wx_batch_send_message = @current_wx_official_account.wx_batch_send_messages.new
        wx_batch_send_message.msg_id =  __result.result[:msg_id]
        wx_batch_send_message.msg_data_id =  __result.result[:msg_data_id]

        wx_batch_send_message.msg_type = params[:msg_type]
        wx_batch_send_message.msg_content = params[:msg_content]

        if params[:group] != "all"
          wx_batch_send_message.wx_user_group_id = params[:group]
        end
        if params[:gender] != "all"
          wx_batch_send_message.gender = params[:gender]
        end

        if params[:country] != "all"
          wx_batch_send_message.wx_country_id = params[:country]
        end

        if params[:province] != "all"
          wx_batch_send_message.wx_province_id = params[:province]
        end

        if params[:city]!="all"
          wx_batch_send_message.wx_city_id = params[:city]
        end
        wx_batch_send_message.is_deleted = 0
        wx_batch_send_message.create_time = DateTime.now

        wx_batch_send_message.save

        render json: {"result" => "ok"}
      else
        render json: {"result" => "false","errorMsg"=>"群发失败"}
      end




    end



  end


  private
  def setImgGroupsDatas
    # 此公众号下面的所有图片资源
    @img_resouces = @current_wx_official_account
                        .wx_resources.where("resource_type=2 and deleted=0")
    # 此公众号下面的所有图片分组
    img_groups = @current_wx_official_account.wx_resource_groups

    @group_map = Hash.new
    @group_name_map = Hash.new
    no_name_group = Array.new

    @img_resouces.each do |img_resource|
      # 是为分组的img_resource
      if img_resource.wx_resource_group_id == 1
        no_name_group.append(img_resource)
      end
    end
    @group_map[1] = no_name_group
    @group_name_map[1] = "未分组"

    img_groups.each do |group|
      @group_name_map[group.id] = group.name
      group_array = Array.new
      @img_resouces.each do |img_resource|
        if img_resource.wx_resource_group_id == group.id
          group_array.append(img_resource)
        end
      end
      @group_map[group.id] = group_array
    end
  end




end
