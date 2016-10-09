class WxMenusController < WeixinClientController
  layout 'wx_menus'

  def index
    WORKER_LOG.info "WxMenusController index action begin..."
    unless @current_wx_official_account.nil?
      @wx_menus = @current_wx_official_account.wx_menus.order("sort asc")
      @wx_articles = @current_wx_official_account.wx_articles.group("news_id").having("media_id is not null and cover_file_id is not null")

      setImgGroupsDatas

    end
  end


  # 结合: https://github.com/lanrion/weixin_authorize(建议选用此gem的Redis存access_token方案)
  def create_menu
    WORKER_LOG.info "WxMenusController create_menu action begin..."
    # 将菜单数据包装调用微信接口
    weixin_client = @current_wx_official_account.client

    _result = weixin_client.create_menu(getJsonMenus) # Hash or Json
    # 如果修改菜单接口调用成功，则修改数据库
    if _result.code == 0
      @current_wx_official_account.wx_menus.destroy_all
      params[:menus].each do |key,value|
        wx_menu = @current_wx_official_account.wx_menus.new
        wx_menu.wx_official_account_id = @current_wx_official_account.id
        wx_menu.original_id = @current_wx_official_account.original_id
        wx_menu.key = key
        wx_menu.sort = value[:order]
        wx_menu.name = value[:name]
        wx_menu.level = value[:level]
        wx_menu.parent_id = value[:parent_id]

        unless value[:msg_type].nil?
          wx_menu.msg_type = value[:msg_type]
          if value[:msg_type] == '1'
            wx_menu.url = value[:msg_content]
          else
            wx_menu.msg_content = value[:msg_content]
          end
        end
        wx_menu.save
      end
      render json: {"result" => "success","errmsg"=>_result.cn_msg}
    #  新建或者修改菜单接口的调用失败
    else
      render json: {"result" => "false","errmsg"=>_result.en_msg}
    end

  end


  private
  def getJsonMenus

    weixin_menus = Hash.new
    weixin_menus["button"] = Array.new
    menus_array = params[:menuJson]

    length = menus_array.length

    # for menu in menus_array do
    length.times do |t|
      # menu = menus_array[t]
      menu = menus_array[:"#{t.to_s}"]
        _menu = Hash.new
      # 是父元素
      if menu[:level] == '0'
        _menu["name"] = menu[:name]
        # 没有msg_type说明有子元素
        if menu[:msg_type].nil?
          _menu["sub_button"] = Array.new
          # for submenu in menus_array do
          length.times do |j|
            # submenu = menus_array[j]
            submenu = menus_array[:"#{j.to_s}"]
            if submenu[:level] == '1' and submenu[:parent_id] == menu[:id]
              sub_menu = Hash.new
              sub_menu["name"] = submenu[:name]
              # 如果是ｕｒｌ链接跳转
              if submenu[:msg_type] == '1'
                sub_menu["type"]="view"
                sub_menu["url"] = submenu[:msg_content]
                #  如果是点击事件
              else
                sub_menu["type"]="click"
                sub_menu["key"] = submenu[:id]
              end
              _menu["sub_button"].push(sub_menu)
            end
          end

          # 有msg_type说明没有子元素
        else
          # 如果是ｕｒｌ链接跳转
          if menu[:msg_type] == '1'
            _menu["type"]="view"
            _menu["url"] = menu[:msg_content]
            #  如果是点击事件
          else
            _menu["type"]="click"
            _menu["key"] = menu[:id]
          end
        end
        weixin_menus["button"].push(_menu)
      end
    end

    # menus_obj = params[:menuJson]
    # menus_obj.each do |_key, value|
    #   _menu = Hash.new
    #   # 是父元素
    #   if value[:level] == '0'
    #     _menu["name"] = value[:name]
    #     # 没有msg_type说明有子元素
    #     if value[:msg_type].nil?
    #       _menu["sub_button"] = Array.new
    #       menus_obj.each do |_k, _v|
    #           if _v[:level] == '1' and _v[:parent_id] == _key
    #           sub_menu = Hash.new
    #           sub_menu["name"] = _v[:name]
    #           # 如果是ｕｒｌ链接跳转
    #           if _v[:msg_type] == '1'
    #             sub_menu["type"]="view"
    #             sub_menu["url"] = _v[:msg_content]
    #             #  如果是点击事件
    #           else
    #             sub_menu["type"]="click"
    #             sub_menu["key"] = _k
    #           end
    #           _menu["sub_button"].push(sub_menu)
    #         end
    #       end
    #       # 有msg_type说明没有子元素
    #     else
    #       # 如果是ｕｒｌ链接跳转
    #       if value[:msg_type] == '1'
    #         _menu["type"]="view"
    #         _menu["url"] = value[:msg_content]
    #         #  如果是点击事件
    #       else
    #         _menu["type"]="click"
    #         _menu["key"] = _key
    #       end
    #     end
    #     weixin_menus["button"].push(_menu)
    #   end
    # end


    return weixin_menus

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


  def setNewsData
    @wx_articles = @current_wx_official_account.wx_articles
  end
end
