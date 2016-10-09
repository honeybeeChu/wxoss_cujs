class WxArticlesController < WeixinClientController
  layout "wx_application"

  def index
    unless @current_wx_official_account.nil?
      begin_count = params[:begin].to_i
      if begin_count < 0
        begin_count = 0
      end
      sql ='wx_official_account_id = :wx_official_account_id'
      query = Hash.new
      query[:wx_official_account_id] = @current_wx_official_account.id
      unless params[:query].blank?
        sql.concat(' and (title like :title or author = :author or digest like :digest )')
        query[:title] = "%#{params[:query]}%"
        query[:author] = "#{params[:query]}"
        query[:digest] = "%#{params[:query]}%"
      end
      result = WxArticle.where(sql, query).limit(params[:count]).offset(begin_count).order(:news_id, :index)
      article_list = Hash.new do |k, v|
        k[v] = []
      end
      result.each do |wx_article|
        article_list[wx_article.news_id] << wx_article
      end
      wx_article_items = Array.new
      article_list.sort.reverse.each_with_index { |item, index|
        temp = Hash.new
        temp[:seq] = index
        temp[:app_id] = item[0]
        multi_items = Array.new
        item[1].each_with_index { |sub_item, sub_index|
          sub_item_hash = Hash.new
          sub_item_hash[:seq] = sub_index
          cover_url = WxResource.find(sub_item.cover_file_id).file_url unless sub_item.cover_file_id.nil?
          sub_item_hash[:cover] =cover_url
          sub_item_hash[:title] = sub_item.title
          sub_item_hash[:digest] = sub_item.digest
          sub_item_hash[:content_url] = sub_item.content_url
          sub_item_hash[:file_id] = sub_item.cover_file_id
          sub_item_hash[:source_url] = sub_item.content_source_url
          sub_item_hash[:author] = sub_item.author
          sub_item_hash[:show_cover_pic] = sub_item.show_cover_pic
          sub_item_hash[:copyright_type] = 0
          sub_item_hash[:can_reward] = 0
          sub_item_hash[:reward_wording] = ''
          sub_item_hash[:is_new_video] = 0
          sub_item_hash[:tags] = []
          sub_item_hash[:need_open_comment] = ''
          sub_item_hash[:free_content] = ''
          if sub_index == 0
            temp[:file_id] = sub_item.cover_file_id
            temp[:title] = sub_item.title
            temp[:digest] = sub_item.digest
            temp[:create_time] = sub_item.created_at.to_i
            temp[:content_url] = sub_item.content_url
            temp[:img_url] = cover_url
            temp[:author] = sub_item.author
            temp[:show_cover_pic] = sub_item.show_cover_pic
            temp[:update_time] = sub_item.updated_at.to_i
          end
          multi_items << sub_item_hash
        }
        temp[:multi_item] = multi_items
        wx_article_items << temp
      }
      file_cnt = Hash.new
      file_cnt[:total] = wx_article_items.size
      file_cnt[:img_cnt] = 0
      file_cnt[:voice_cnt] = 0
      file_cnt[:video_cnt] = 0
      file_cnt[:app_msg_cnt] = wx_article_items.size
      file_cnt[:commondity_msg_cnt] = 0
      file_cnt[:video_msg_cnt] = 0
      file_cnt[:short_video_cnt] = 0
      file_cnt[:app_msg_sent_cnt] = 0
      @wx_articles = Hash.new
      @wx_articles[:item] = wx_article_items
      @wx_articles[:file_cnt] = file_cnt
      @wx_articles[:is_upload_cdn_ok] = 0
      @wx_articles[:search_cnt] = result.size
      @wx_articles[:count] = params[:count]
      @wx_articles[:begin] = params[:begin]
      @wx_articles[:type] = 10
      @wx_articles[:view] = params[:view_action] == 'list_card' ? 'card' : 'list'
      @wx_articles[:key] = params[:query]
      @wx_articles[:forbit] = []
      @page_css = 'page_media_list page_appmsg_list'
    end
    render 'wx_resources/index'
  end

  def edit
    news_id = params[:appmsgid]
    wx_article_items = Hash.new
    unless news_id.nil?
      result = WxArticle.where('wx_official_account_id =? and news_id =?', @current_wx_official_account.id, news_id).order(:index)
      wx_article_items[:seq] = 0
      wx_article_items[:app_id] = news_id
      multi_items = Array.new
      result.each_with_index { |item, index|
        sub_item_hash = Hash.new
        sub_item_hash[:seq] = index
        cover_url = WxResource.find(item.cover_file_id).file_url unless item.cover_file_id.nil?
        sub_item_hash[:cover] = cover_url||''
        sub_item_hash[:title] = item.title
        sub_item_hash[:digest] = item.digest
        sub_item_hash[:content_url] = item.content_url||''
        sub_item_hash[:file_id] = item.cover_file_id||''
        sub_item_hash[:content] = item.content
        sub_item_hash[:source_url] = item.content_source_url||''
        sub_item_hash[:author] = item.author
        sub_item_hash[:show_cover_pic] = item.show_cover_pic
        sub_item_hash[:copyright_type] = 0
        sub_item_hash[:can_reward] = 0
        sub_item_hash[:reward_wording] = ''
        sub_item_hash[:is_new_video] = 0
        sub_item_hash[:tags] = []
        sub_item_hash[:need_open_comment] = ''
        sub_item_hash[:free_content] = ''
        if index == 0
          wx_article_items[:file_id] = item.cover_file_id||''
          wx_article_items[:title] = item.title
          wx_article_items[:digest] = item.digest
          wx_article_items[:content] = item.content
          wx_article_items[:create_time] = item.created_at.to_i
          wx_article_items[:content_url] = item.content_url
          wx_article_items[:img_url] = cover_url||''
          wx_article_items[:author] = item.author
          wx_article_items[:show_cover_pic] = item.show_cover_pic
          wx_article_items[:update_time] = item.updated_at.to_i
        end
        multi_items << sub_item_hash
      }
      wx_article_items[:multi_item] = multi_items
    end
    @cgiData = Hash.new
    @cgiData[:svr_time] = Time.now.to_i
    @cgiData[:updateTime] = wx_article_items[:update_time]
    @cgiData[:app_id] = news_id
    @cgiData[:type] = params[:type]
    @cgiData[:isNew] = params[:isNew]
    @cgiData[:appmsg_data] = wx_article_items
    @cgiData[:can_use_vote] = 1
    @cgiData[:biz_uin] = ''
    @cgiData[:cardid] = ''
    @cgiData[:cardnum] = 0
    @cgiData[:can_use_hyperlink] = 0
    @cgiData[:can_use_card] = 0
    @cgiData[:can_use_copyright] = 0
    @cgiData[:can_use_reward] = 0
    @cgiData[:can_use_shortvideo] = 0
    @cgiData[:can_use_payforread] = 0
    @cgiData[:is_link_white] = 0
    @cgiData[:can_use_voice] = 0
    @cgiData[:shortvideo_sn] = ''
    @cgiData[:qqmusic_flag] = 1
    @cgiData[:fromview] = 'card'
    @cgiData[:can_use_txvideo] = 0
    @cgiData[:orginal_apply_stat] = 0
    @cgiData[:has_invited_original] = 0
    @cgiData[:can_use_comment] = 0
    @cgiData[:can_use_wxshop] = 0
    @cgiData[:can_use_new_editor] = 0
    @cgiData[:func_ban_info] = []
    render 'wx_resources/new', layout: false
  end

  def create
    news_id = params[:AppMsgId]
    if news_id.blank?
      news_id = Time.now.to_i
    else
      WxArticle.delete_article(news_id, @current_wx_official_account)
    end
    articles = Array.new
    params[:count].to_i.times do |i|
      title = params[:title.to_s + i.to_s]
      author = params[:author.to_s + i.to_s]
      content = params[:content.to_s + i.to_s]
      digest = params[:digest.to_s + i.to_s]
      content_source_url = params[:sourceurl.to_s + i.to_s]
      show_cover_pic = params[:show_cover_pic.to_s + i.to_s]
      cover_file_id= params[:fileid.to_s + i.to_s]
      wx_resource = WxResource.find(cover_file_id) unless cover_file_id.blank?
      thumb_media_id = wx_resource.try(:media_id)
      #素材同步信息
      article = Hash.new
      article[:title] = title
      article[:thumb_media_id] = thumb_media_id
      article[:author] = author
      article[:digest] = digest
      article[:show_cover_pic] =show_cover_pic
      content_img_list = Array.new
      content.scan(/\/wxoss\/wx_articles\/resources\/getimgdata\?fileId=\d{1,11}/) { |match|
        content_img_list << match.split('=')[1]
      }
      content_img_replace = Hash.new
      content_img_list.each do |img_id|
        key = '/wxoss/wx_articles/resources/getimgdata?fileId='.concat(img_id.to_s)
        content_img_replace.store(key, WxResource.find(img_id).wx_url)
      end
      content_img_replace.each do |key, value|
        content.gsub!(key, value)
      end
      article[:content] = content
      article[:content_source_url] = content_source_url
      articles << article

      wx_article = WxArticle.new(news_id: news_id, index: i,
                                 wx_official_account_id: @current_wx_official_account.id,
                                 title: title, author: author, content: content, digest: digest,
                                 show_cover_pic: show_cover_pic, content_source_url: content_source_url,
                                 cover_file_id: cover_file_id, thumb_media_id: thumb_media_id)
      wx_article.save
    end
    wx_post_flag = true
    articles.each do |item|
      item.each { |key, value|
        if value.blank?
          wx_post_flag = false
        end
      }
    end
    if wx_post_flag
      remote_result = @current_wx_official_account.wx_post(ADD_NEWS, {articles: articles})
      WxArticle.where(:news_id => news_id).update_all(:media_id => remote_result.result[:media_id])
    end
    save_resp = Hash.new
    save_resp[:msg] = ''
    save_resp[:ret] = 0
    base_resp = Hash.new
    base_resp[:err_msg] = 'ok'
    base_resp[:ret] = 0
    save_resp[:base_resp] = base_resp
    save_resp[:appMsgId] = news_id
    render :text => save_resp.to_json
  end

  def destroy
    news_id = params[:AppMsgId]
    if WxMenu.article_use(news_id)||WxResponseContent.article_use(news_id)
      ret = 1
    else
      WxArticle.delete_article(news_id, @current_wx_official_account)
      ret = 0
    end
    render :json => {:ret => ret}
  end

  private
  def suc_msg
    base_resp = Hash.new
    base_resp[:err_msg] = 'ok'
    base_resp[:ret] = 0
    return base_resp
  end
end
