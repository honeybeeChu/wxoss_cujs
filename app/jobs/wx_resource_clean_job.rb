class WxResourceCleanJob < ActiveJob::Base
  queue_as :default

  def perform(*args)
    wx_resources = WxResource.find_by_sql("select a.id,a.file_url from wx_resources a where a.deleted = 1 and a.id not in (select distinct cover_file_id from wx_articles)")
    wx_resources.each do |wx_resource|
      WxResource.destroy(wx_resource.id)
    end
  end
end
