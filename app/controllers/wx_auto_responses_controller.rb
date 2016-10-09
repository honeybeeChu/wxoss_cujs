class WxAutoResponsesController < WeixinClientController
  # before_action :set_wx_auto_response, only: [:update_response, :delete_response]
  layout 'wx_auto_responses'


  def index
    #  type为nil，是被添加自动回复页面
    if params[:type].nil?
      setResponseData(1)
      render "index"
    elsif params[:type]=="message_response" #消息自动回复
      setResponseData(2)
      render params[:type]
    else
      @wx_key_responses = @current_wx_official_account
                              .wx_key_responses
      # @wx_articles = @current_wx_official_account.wx_articles
      @wx_articles = @current_wx_official_account.wx_articles.group("news_id").having("media_id is not null and cover_file_id is not null")

      setImgGroupsDatas
      render params[:type]
    end
  end


  def update_response
    get_wx_auto_response params[:wx_auto_response][:event_type]
    if @wx_auto_response.update({"res_type" => params[:wx_auto_response][:res_type], "res_content" => params[:wx_auto_response][:res_content], "event_type" => params[:wx_auto_response][:event_type]})
      render json: {"result" => "success"}
    else
      render json: {"result" => "false"}
    end
  end


  # 修改已有的关键字回复规则
  def update_key_response
    wx_key_response = WxKeyResponse.find(params[:id])
    wx_key_response.rule_name = params[:rule_name]
    wx_key_response.is_response_all= [:is_response_all]
    if wx_key_response.save
      # 循环保存关键字信息
      keys = params[:keys]
      keys.map do |keyObj|
        # id为空，是新增的关键字
        if keyObj[1][:id].nil?
          @wx_key = wx_key_response.wx_keys.new
          @wx_key.wx_key_response_id = wx_key_response.id
          @wx_key.key = keyObj[1][:key]
          @wx_key.is_match = keyObj[1][:is_match]
          @wx_key.save
          # id不为空是删除或者修改关键字
        else
          @wx_key = WxKey.find(keyObj[1][:id])
          # 是删除
          if keyObj[1][:is_delete]
            @wx_key.destroy
          else
            @wx_key.key = keyObj[1][:key]
            @wx_key.is_match = keyObj[1][:is_match]
            @wx_key.save
          end
        end
      end


      # 循环保存关键字回复的内容信息
      reply_content = params[:reply_content]
      reply_content.map do |replyObj|

        # 如果ｉｄ是空，就是新增的回复内容
        if replyObj[1][:id].nil?
          @wx_respnse_content = wx_key_response.wx_response_contents.new
          @wx_respnse_content.wx_key_response_id = wx_key_response.id
          # 如果回复内容是文字
          if replyObj[1][:content_type] == '0'
            @wx_respnse_content.text_content = replyObj[1][:text_content]
          else
            @wx_respnse_content.media_content = replyObj[1][:media_content]
          end
          @wx_respnse_content.content_type = replyObj[1][:content_type]
          @wx_respnse_content.save
        #   Id 不为空是删除或者修改操作
        else
          @wx_respnse_content = WxResponseContent.find(replyObj[1][:id])
          # 是删除
          if replyObj[1][:is_delete]
            @wx_respnse_content.destroy
          else
            # 如果回复内容是文字
            if replyObj[1][:content_type] == '0'
              @wx_respnse_content.text_content = replyObj[1][:text_content]
            else
              @wx_respnse_content.media_content = replyObj[1][:media_content]
            end
            @wx_respnse_content.content_type = replyObj[1][:content_type]
            @wx_respnse_content.save
          end
        end
      end
      render json: {"result" => "success"}
    else
      render json: {"result" => "false"}
    end
  end


  # 删除回复
  def delete_response
    get_wx_auto_response params[:event_type]
    if @wx_auto_response.nil?
      render json: {"result" => "false"}
    else
      @wx_auto_response.destroy
      render json: {"result" => "success"}
    end
  end

  # 删除
  def delete_wx_key_response
    get_wx_key_response params[:rule_id]
    if @wx_key_response.nil?
      render json: {"result" => "false"}
    else
      @wx_key_response.destroy
      render json: {"result" => "success"}
    end
  end

  # 新建新的自动回复
  def create_response
    @wx_auto_response = @current_wx_official_account.wx_auto_responses.new
    @wx_auto_response.res_type = params[:wx_auto_response][:res_type]
    @wx_auto_response.event_type = params[:wx_auto_response][:event_type]
    @wx_auto_response.res_content = params[:wx_auto_response][:res_content]

    @wx_auto_response.wx_official_account_id = session[:current_official_account_id]

    @wx_auto_response.original_id=@current_wx_official_account.original_id

    if @wx_auto_response.save
      render json: {"result" => "success"}
    else
      render json: {"result" => "false"}
    end
  end


  # 新建关键字自动回复数据
  def create_key_response
    wx_key_response = @current_wx_official_account.wx_key_responses.new
    wx_key_response.rule_name= params[:rule_name]
    wx_key_response.is_response_all= [:is_response_all]
    # 如果关键字回复保存成功，则保存相应的关键字和回复的内容
    if (wx_key_response.save)
      # 循环保存关键字信息
      keys = params[:keys]
      keys.map do |keyObj|
        wx_key = wx_key_response.wx_keys.new
        wx_key.key = keyObj[1][:key]
        wx_key.wx_key_response_id = wx_key_response.id
        wx_key.is_match = keyObj[1][:is_match]
        wx_key.save
      end

      # 循环保存关键字回复的内容信息
      reply_content = params[:reply_content]
      reply_content.map do |replyObj|
        wx_respnse_content = wx_key_response.wx_response_contents.new
        # 如果回复内容是文字
        if replyObj[1][:content_type] == '0'
          wx_respnse_content.wx_key_response_id = wx_key_response.id
          wx_respnse_content.content_type = replyObj[1][:content_type]
          wx_respnse_content.text_content = replyObj[1][:text_content]
        else
          wx_respnse_content.wx_key_response_id = wx_key_response.id
          wx_respnse_content.content_type = replyObj[1][:content_type]
          wx_respnse_content.media_content = replyObj[1][:media_content]
        end
        wx_respnse_content.save
      end

      render json: {"result" => "success"}
    else
      render json: {"result" => "false"}
    end
  end


  private
  def wx_auto_response_params
    params.require(:wx_auto_response).permit(:res_content, :res_img_cache, :res_type, :event_type, :remote_res_img_url)
  end

  def get_wx_auto_response event_type
    @wx_auto_response = @current_wx_official_account.wx_auto_responses.find_by("event_type=" + event_type)

  end

  def get_wx_key_response rule_id
    @wx_key_response = @current_wx_official_account.wx_key_responses.find_by("id=" + rule_id)

  end


  def setResponseData event_type
    unless @current_wx_official_account.nil?
      @wx_auto_response = @current_wx_official_account
                              .wx_auto_responses.find_by("event_type=#{event_type}")
      # 有此自动回复，并且不是文字的回复
      if @wx_auto_response != nil and @wx_auto_response.res_type != 1
        @wx_resource = @current_wx_official_account
                           .wx_resources.find(@wx_auto_response.res_content)
      end
      setImgGroupsDatas
      # @group_map["no_name"] = no_name_group

    end
  end

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
