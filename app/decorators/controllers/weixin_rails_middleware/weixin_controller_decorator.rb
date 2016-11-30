# encoding: utf-8
# 1, @weixin_message: 获取微信所有参数.
# 2, @weixin_public_account: 如果配置了public_account_class选项,则会返回当前实例,否则返回nil.
# 3, @keyword: 目前微信只有这三种情况存在关键字: 文本消息, 事件推送, 接收语音识别结果
WeixinRailsMiddleware::WeixinController.class_eval do
  def reply
    WORKER_LOG.info "weixin_controller_decorator controller reply action begin..."

    WORKER_LOG.info @weixin_message.to_json.to_s

    render xml: send("response_#{@weixin_message.MsgType}_message", {})
  end

  private

  def response_text_message(options={})
    is_key_response = false
    response_content = ""
    #过滤关键字后，回复消息
    @wx_key_responses = @weixin_public_account.wx_key_responses
    weixin_client = @weixin_public_account.client
    responses = @wx_key_responses.to_json

    responseArray = Array.new


    #循环规则表,只要匹配到一个规则的关键字，匹配成功，结束循环
    @wx_key_responses.each do |wx_key_response|
      if is_key_response
        break
      end
      # 循环遍历关键字
      wx_key_response.wx_keys.each do |wx_key|
        if is_key_response
          break
        end

        # 如果是全匹配
        if wx_key.is_match
          if wx_key.key == @keyword

            #   回复设置的消息
            wx_key_response.wx_response_contents.each do |reply_content|
              responseArray.push(reply_content)
            end
            is_key_response = true
            break
          end
          #   如果不是全匹配
        else
          # 用户的信息是否包含关键字
          if @keyword.include? wx_key.key
            # 回复设置的消息
            wx_key_response.wx_response_contents.each do |reply_content|
              responseArray.push(reply_content)
            end
            is_key_response = true
            break
          end
        end
      end
    end


    # 属于关键字的回复
    if is_key_response
      # 前几条用客服接口进行回复
      length = responseArray.length
      length.times do |i|
        resp = responseArray[i]
        if i != length-1
          case resp.content_type
            when 0      #文字
              weixin_client.send_text_custom(@weixin_message.FromUserName,resp.text_content)
            when 1      #图片
              img_media_id = @weixin_public_account.wx_resources.find(resp.media_content).media_id
              weixin_client.send_image_custom(@weixin_message.FromUserName,img_media_id)
            when 2      #图文
              news_map = @weixin_public_account.get_news_params_by_mediaid resp_last.media_content
              article = generate_article(news_map['title'], news_map['desc'], news_map['pic_url'],news_map['link_url'])
              articles = Array.new
              weixin_client.send_news_custom(@weixin_message.FromUserName,articles)
            when 3
              weixin_client.send_text_custom(@weixin_message.FromUserName,resp.media_content)
            when 4
              weixin_client.send_text_custom(@weixin_message.FromUserName,resp.media_content)
            else
              weixin_client.send_text_custom(@weixin_message.FromUserName,resp.media_content)
          end
        end
      end
      # 最后一条用被动回复
      resp_last = responseArray[length-1]

      case resp_last.content_type
        when 0      #文字
          reply_text_message(resp_last.text_content)
        when 1      #图片
          reply_image_message(generate_image(@weixin_public_account.wx_resources.find(resp_last.media_content).media_id))
        when 2      #图文
          news_map = @weixin_public_account.get_news_params_by_mediaid resp_last.media_content
          article = generate_article(news_map['title'], news_map['desc'], news_map['pic_url'],news_map['link_url'])
          articles = Array.new
          articles.push(article)
          reply_news_message(articles)
        when 3
          reply_text_message(resp_last.media_content)
        when 4
          reply_text_message(resp_last.media_content)
        else
          reply_text_message(resp_last.media_content)
      end

    # 如果不是关键字的回复，回复的是消息自动回复的内容
    else
      wx_auto_response = @weixin_public_account.wx_auto_responses.find_by("event_type=2")
      unless wx_auto_response.nil?
        if wx_auto_response.res_type == 1 #回复文字信息
          reply_text_message(wx_auto_response.res_content)
        elsif wx_auto_response.res_type == 2 #回复图片信息
          media_id = @weixin_public_account.wx_resources.find(wx_auto_response.res_content).media_id
          reply_image_message(generate_image(media_id))
        end
      end
    end

    # reply_text_message("Your Message: #{@keyword}")
  end

  # <Location_X>23.134521</Location_X>
  # <Location_Y>113.358803</Location_Y>
  # <Scale>20</Scale>
  # <Label><![CDATA[位置信息]]></Label>
  def response_location_message(options={})
    @lx = @weixin_message.Location_X
    @ly = @weixin_message.Location_Y
    @scale = @weixin_message.Scale
    @label = @weixin_message.Label
    reply_text_message("Your Location: #{@lx}, #{@ly}, #{@scale}, #{@label}")
  end

  # <PicUrl><![CDATA[this is a url]]></PicUrl>
  # <MediaId><![CDATA[media_id]]></MediaId>
  def response_image_message(options={})
    @media_id = @weixin_message.MediaId # 可以调用多媒体文件下载接口拉取数据。
    @pic_url = @weixin_message.PicUrl # 也可以直接通过此链接下载图片, 建议使用carrierwave.
    reply_image_message(generate_image(@media_id))
  end

  # <Title><![CDATA[公众平台官网链接]]></Title>
  # <Description><![CDATA[公众平台官网链接]]></Description>
  # <Url><![CDATA[url]]></Url>
  def response_link_message(options={})
    @title = @weixin_message.Title
    @desc = @weixin_message.Description
    @url = @weixin_message.Url
    reply_text_message("回复链接信息")
  end

  # <MediaId><![CDATA[media_id]]></MediaId>
  # <Format><![CDATA[Format]]></Format>
  def response_voice_message(options={})
    @media_id = @weixin_message.MediaId # 可以调用多媒体文件下载接口拉取数据。
    @format = @weixin_message.Format
    # 如果开启了语音翻译功能，@keyword则为翻译的结果
    # reply_text_message("回复语音信息: #{@keyword}")
    reply_voice_message(generate_voice(@media_id))
  end

  # <MediaId><![CDATA[media_id]]></MediaId>
  # <ThumbMediaId><![CDATA[thumb_media_id]]></ThumbMediaId>
  def response_video_message(options={})
    @media_id = @weixin_message.MediaId # 可以调用多媒体文件下载接口拉取数据。
    # 视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据。
    @thumb_media_id = @weixin_message.ThumbMediaId
    reply_text_message("回复视频信息")
  end

  def response_event_message(options={})
    event_type = @weixin_message.Event
    method_name = "handle_#{event_type.downcase}_event"
    if self.respond_to? method_name, true
      send(method_name)
    else
      send("handle_undefined_event")
    end
  end

  # 关注公众账号
  def handle_subscribe_event
    WORKER_LOG.info "关注公众账号"
    des_text = "<xml><ToUserName><![CDATA[#{@weixin_message.ToUserName}]]></ToUserName><FromUserName><![CDATA[#{@weixin_message.FromUserName}]]></FromUserName>"+
        "<CreateTime>#{@weixin_message.CreateTime}</CreateTime><MsgType><![CDATA[#{@weixin_message.MsgType}]]></MsgType><Event><![CDATA[#{@weixin_message.Event}]]></Event></xml>"
    postResult = post(ACCESS_INTERNET_URL, des_text)

    WORKER_LOG.info postResult

    _content = getContentFromXml postResult
    reply_text_message(_content)

    # if @keyword.present?
    #   # 扫描带参数二维码事件: 1. 用户未关注时，进行关注后的事件推送
    #   return reply_text_message("扫描带参数二维码事件: 1. 用户未关注时，进行关注后的事件推送, keyword: #{@keyword}")
    # end
    # autoresponse = @weixin_public_account.wx_auto_responses.find_by("event_type=1")
    # unless autoresponse.nil?
    #     #如果是文字的回复
    #   if autoresponse.res_type == 1
    #     reply_text_message(autoresponse.res_content)
    #   end
    # end

  end

  # 取消关注
  def handle_unsubscribe_event
    des_text = "<xml><ToUserName><![CDATA[#{@weixin_message.ToUserName}]]></ToUserName><FromUserName><![CDATA[#{@weixin_message.FromUserName}]]></FromUserName>"+
        "<CreateTime>#{@weixin_message.CreateTime}</CreateTime><MsgType><![CDATA[#{@weixin_message.MsgType}]]></MsgType><Event><![CDATA[#{@weixin_message.Event}]]></Event></xml>"
    postResult = post(ACCESS_INTERNET_URL, des_text)
    WORKER_LOG.info postResult

    _content = getContentFromXml postResult
    reply_text_message(_content)

    Rails.logger.info("取消关注")
    WORKER_LOG.info "取消关注公众号..."
  end

  # 扫描带参数二维码事件: 2. 用户已关注时的事件推送
  def handle_scan_event
    reply_text_message("扫描带参数二维码事件: 2. 用户已关注时的事件推送, keyword: #{@keyword}")
  end

  def handle_location_event # 上报地理位置事件
    @lat = @weixin_message.Latitude
    @lgt = @weixin_message.Longitude
    @precision = @weixin_message.Precision
    reply_text_message("Your Location: #{@lat}, #{@lgt}, #{@precision}")
  end

  # 点击菜单拉取消息时的事件推送
  def handle_click_event
    sendHash = nil
    @weixin_public_account.wx_menus.each do |menu|
      if menu.msg_type != nil and @keyword == menu.key
        sendHash = menu
      end
    end

    if sendHash.nil?
      WORKER_LOG.error "没有对应的Key的处理逻辑"
      # 跳转ｕｒｌ不用处理
    elsif sendHash.msg_type == 1
      WORKER_LOG.info "跳转配置的链接#{@weixin_message.EventKey}"
    #   图文消息
    elsif sendHash.msg_type == 2
      news_map = @weixin_public_account.get_news_params_by_mediaid sendHash.msg_content
      article = generate_article(news_map['title'], news_map['desc'], news_map['pic_url'],news_map['link_url'])
      articles = Array.new
      articles.push(article)
      reply_news_message(articles)
    elsif sendHash.msg_type == 5 or sendHash.msg_type == 6
      reply_text_message(sendHash.msg_content)
    elsif sendHash.msg_type == 4
      reply_image_message(generate_image(@weixin_public_account.wx_resources.find(sendHash.msg_content).media_id))
    elsif sendHash.msg_type == 3
      reply_text_message(sendHash.msg_content)
    elsif sendHash.msg_type == 7
      des_text = "<xml><ToUserName><![CDATA[#{@weixin_message.ToUserName}]]></ToUserName><FromUserName><![CDATA[#{@weixin_message.FromUserName}]]></FromUserName>"+
          "<CreateTime>#{@weixin_message.CreateTime}</CreateTime><MsgType><![CDATA[#{@weixin_message.MsgType}]]></MsgType><Event><![CDATA[#{@weixin_message.Event}]]>"+
          "</Event><EventKey><![CDATA[hqlj]]></EventKey></xml>"
      postResult = post(ACCESS_INTERNET_URL, des_text)
      _content = getContentFromXml postResult
      reply_text_message(_content)
    else
      WORKER_LOG.error "没有对应的msg_type的处理逻辑"
    end
  end

  # 点击菜单跳转链接时的事件推送
  def handle_view_event
    # Rails.logger.info("你点击了: #{@keyword}")
    WORKER_LOG.info "你点击了: #{@keyword},进行了页面跳转"
  end

  # 帮助文档: https://github.com/lanrion/weixin_authorize/issues/22

  # 由于群发任务提交后，群发任务可能在一定时间后才完成，因此，群发接口调用时，仅会给出群发任务是否提交成功的提示，若群发任务提交成功，则在群发任务结束时，会向开发者在公众平台填写的开发者URL（callback URL）推送事件。

  # 推送的XML结构如下（发送成功时）：

  # <xml>
  # <ToUserName><![CDATA[gh_3e8adccde292]]></ToUserName>
  # <FromUserName><![CDATA[oR5Gjjl_eiZoUpGozMo7dbBJ362A]]></FromUserName>
  # <CreateTime>1394524295</CreateTime>
  # <MsgType><![CDATA[event]]></MsgType>
  # <Event><![CDATA[MASSSENDJOBFINISH]]></Event>
  # <MsgID>1988</MsgID>
  # <Status><![CDATA[sendsuccess]]></Status>
  # <TotalCount>100</TotalCount>
  # <FilterCount>80</FilterCount>
  # <SentCount>75</SentCount>
  # <ErrorCount>5</ErrorCount>
  # </xml>
  def handle_masssendjobfinish_event
    WORKER_LOG.info "处理群发消息的结果回调"
    WORKER_LOG.info("处理群发消息的结果回调")
    WORKER_LOG.info("MsgID:" + @weixin_message.MsgID.to_s)
    WORKER_LOG.info("Status:" + @weixin_message.Status.to_s)
    WORKER_LOG.info("TotalCount:" + @weixin_message.TotalCount.to_s)
    # 群发消息的回调处理，修改此群发消息的状态和发送详情
    batch_message = @weixin_public_account.wx_batch_send_messages.where("msg_id="+@weixin_message.MsgID)[0]
    batch_message.msg_status = @weixin_message.Status
    batch_message.totalCount = @weixin_message.TotalCount
    batch_message.filterCount = @weixin_message.FilterCount
    batch_message.sentCount = @weixin_message.SentCount
    batch_message.errorCount = @weixin_message.ErrorCount
    batch_message.save

  end

  # <xml>
  # <ToUserName><![CDATA[gh_7f083739789a]]></ToUserName>
  # <FromUserName><![CDATA[oia2TjuEGTNoeX76QEjQNrcURxG8]]></FromUserName>
  # <CreateTime>1395658920</CreateTime>
  # <MsgType><![CDATA[event]]></MsgType>
  # <Event><![CDATA[TEMPLATESENDJOBFINISH]]></Event>
  # <MsgID>200163836</MsgID>
  # <Status><![CDATA[success]]></Status>
  # </xml>
  # 推送模板信息回调，通知服务器是否成功推送
  def handle_templatesendjobfinish_event
    Rails.logger.info("回调事件处理")
  end

  # <xml>
  # <ToUserName><![CDATA[toUser]]></ToUserName>
  # <FromUserName><![CDATA[FromUser]]></FromUserName>
  # <CreateTime>123456789</CreateTime>
  # <MsgType><![CDATA[event]]></MsgType>
  # <Event><![CDATA[card_pass_check]]></Event>  //不通过为card_not_pass_check
  # <CardId><![CDATA[cardid]]></CardId>
  # </xml>
  # 卡券审核事件，通知服务器卡券已(未)通过审核
  def handle_card_pass_check_event
    Rails.logger.info("回调事件处理")
  end

  def handle_card_not_pass_check_event
    Rails.logger.info("回调事件处理")
  end

  # <xml>
  # <ToUserName><![CDATA[toUser]]></ToUserName>
  # <FromUserName><![CDATA[FromUser]]></FromUserName>
  # <FriendUserName><![CDATA[FriendUser]]></FriendUserName>
  # <CreateTime>123456789</CreateTime>
  # <MsgType><![CDATA[event]]></MsgType>
  # <Event><![CDATA[user_get_card]]></Event>
  # <CardId><![CDATA[cardid]]></CardId>
  # <IsGiveByFriend>1</IsGiveByFriend>
  # <UserCardCode><![CDATA[12312312]]></UserCardCode>
  # <OuterId>0</OuterId>
  # </xml>
  # 卡券领取事件推送
  def handle_user_get_card_event
    Rails.logger.info("回调事件处理")
  end

  # <xml>
  # <ToUserName><![CDATA[toUser]]></ToUserName>
  # <FromUserName><![CDATA[FromUser]]></FromUserName>
  # <CreateTime>123456789</CreateTime>
  # <MsgType><![CDATA[event]]></MsgType>
  # <Event><![CDATA[user_del_card]]></Event>
  # <CardId><![CDATA[cardid]]></CardId>
  # <UserCardCode><![CDATA[12312312]]></UserCardCode>
  # </xml>
  # 卡券删除事件推送
  def handle_user_del_card_event
    Rails.logger.info("回调事件处理")
  end

  # <xml>
  # <ToUserName><![CDATA[toUser]]></ToUserName>
  # <FromUserName><![CDATA[FromUser]]></FromUserName>
  # <CreateTime>123456789</CreateTime>
  # <MsgType><![CDATA[event]]></MsgType>
  # <Event><![CDATA[user_consume_card]]></Event>
  # <CardId><![CDATA[cardid]]></CardId>
  # <UserCardCode><![CDATA[12312312]]></UserCardCode>
  # <ConsumeSource><![CDATA[(FROM_API)]]></ConsumeSource>
  # </xml>
  # 卡券核销事件推送
  def handle_user_consume_card_event
    Rails.logger.info("回调事件处理")
  end

  # <xml>
  # <ToUserName><![CDATA[toUser]]></ToUserName>
  # <FromUserName><![CDATA[FromUser]]></FromUserName>
  # <CreateTime>123456789</CreateTime>
  # <MsgType><![CDATA[event]]></MsgType>
  # <Event><![CDATA[user_view_card]]></Event>
  # <CardId><![CDATA[cardid]]></CardId>
  # <UserCardCode><![CDATA[12312312]]></UserCardCode>
  # </xml>
  # 卡券进入会员卡事件推送
  def handle_user_view_card_event
    Rails.logger.info("回调事件处理")
  end

  # <xml>
  # <ToUserName><![CDATA[toUser]]></ToUserName>
  # <FromUserName><![CDATA[FromUser]]></FromUserName>
  # <CreateTime>123456789</CreateTime>
  # <MsgType><![CDATA[event]]></MsgType>
  # <Event><![CDATA[user_enter_session_from_card]]></Event>
  # <CardId><![CDATA[cardid]]></CardId>
  # <UserCardCode><![CDATA[12312312]]></UserCardCode>
  # </xml>
  # 从卡券进入公众号会话事件推送
  def handle_user_enter_session_from_card_event
    Rails.logger.info("回调事件处理")
  end

  # <xml>
  # <ToUserName><![CDATA[toUser]]></ToUserName>
  # <FromUserName><![CDATA[fromUser]]></FromUserName>
  # <CreateTime>1408622107</CreateTime>
  # <MsgType><![CDATA[event]]></MsgType>
  # <Event><![CDATA[poi_check_notify]]></Event>
  # <UniqId><![CDATA[123adb]]></UniqId>
  # <PoiId><![CDATA[123123]]></PoiId>
  # <Result><![CDATA[fail]]></Result>
  # <Msg><![CDATA[xxxxxx]]></Msg>
  # </xml>
  # 门店审核事件推送
  def handle_poi_check_notify_event
    Rails.logger.info("回调事件处理")
  end

  # 未定义的事件处理
  def handle_undefined_event
    Rails.logger.info("回调事件处理")
  end

  # ｐｏｓｔ请求处理方法
  def post(url, params)
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    if uri.scheme == 'https'
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      http.use_ssl = true
    end
    begin
      request = Net::HTTP::Post.new(uri.request_uri)
      request['Content-Type'] = 'application/json;charset=utf-8'
      request['User-Agent'] = 'Mozilla/5.0 (Windows NT 5.1; rv:29.0) Gecko/20100101 Firefox/29.0'
      request['X-ACL-TOKEN'] = 'xxx_token'
      #request.set_form_data(params)
      request.body = params
      response = http.start { |http| http.request(request) }

      return response.body
    rescue => err
      return nil
    end
  end


  # 获取ｘｍｌ结构中的Ｃｏｎtent
  def getContentFromXml xmlStr
    _index = xmlStr.index("<Content>") + 18
    _end = xmlStr.index("</Content>") -3
    return xmlStr[_index, _end-_index]
  end


end
