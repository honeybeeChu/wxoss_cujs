class WxArticle < ActiveRecord::Base
  belongs_to :wx_official_account

  class << self

    def delete_article(news_id, wx_official_account)
      result = where(news_id: news_id).take
      unless result.media_id.blank?
        wx_official_account.wx_post(DEL_MATERIAL, {:media_id => result.media_id})
      end
      delete_all("news_id = '#{news_id}'")
    end

    def article_use(resource_ids)
      result = Array.new
      where('cover_file_id in (?)', resource_ids).each do |wx_article|
        result << wx_article.cover_file_id.to_s
      end
      result
    end

    def wx_data_pull(wx_official_account, news_count)
      result = wx_official_account.wx_post(BATCHGET_MATERIAL, {'type': 'news', 'offset': 0, 'count': news_count})
      if result.is_ok?
        transaction do
          delete_all(wx_official_account_id: wx_official_account.id)
          result.result[:item].each do |news|
            media_id = news[:media_id]
            news[:content][:news_item].each_with_index { |article, index|
              wx_resource = WxResource.find_by_media_id(article[:thumb_media_id])
              params = {wx_official_account_id: wx_official_account.id,
                        title: article[:title], thumb_media_id: article[:thumb_media_id],
                        show_cover_pic: article[:show_cover_pic], author: article[:author],
                        digest: article[:digest], content_source_url: article[:content_source_url],
                        media_id: media_id, news_id: media_id, content: article[:content],
                        cover_file_id: wx_resource.try(:id),
                        content_url: article[:url], index: index, updated_at: Time.at(news[:update_time])}
              existed = where(wx_official_account_id: wx_official_account.id, media_id: media_id, index: index).take
              if existed
                existed.update(params)
              else
                wx_article = WxArticle.new(params)
                wx_article.save
              end
            }
          end
        end
      end
    end
  end
end
