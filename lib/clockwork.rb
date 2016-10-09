require File.expand_path('../../config/boot', __FILE__)
require File.expand_path('../../config/environment', __FILE__)
include Clockwork

every(1.day, '微信数据统计任务', :at => '09:00') do
  WxMsgStatJob.perform_later
  WxMsgdistStatJob.perform_later
  WxInterfaceStatJob.perform_later
end

every(1.day, '基础素材清理任务', :at => '23:30') do
  WxResourceCleanJob.perform_later
end

every(1.day, '用户数据统计任务', :at => '09:00') do
  WxUserStatJob.perform_later
end