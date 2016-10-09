class WxResponseContent < ActiveRecord::Base
  belongs_to :wx_key_response

  class << self
    def resource_use(resource_ids)
      result = Array.new
      where(media_content: resource_ids).each do |wx_response_content|
        result << wx_response_content.media_content
      end
      result
    end

    def article_use(news_id)
      where(content_type: 2, media_content: news_id).count > 0 ? true : false
    end
  end
end
