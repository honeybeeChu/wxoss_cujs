# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
Rails.application.initialize!

WEIXIN_SERVER = 'http://yaxin-nanjing.com/wxoss'.freeze


SYSTEM_ID="111"
#AIUAS_URL="http://10.1.234.78:9871/aiuas/ciserver/adminauth.action".freeze
AIUAS_URL="http://10.21.17.175:9871/aiuas/ciserver/adminauth.action".freeze
# AIUAS_URL="http://10.117.206.121:85/aiuas/ciserver/adminauth.action".freeze

GET_MATERIALCOUNT = 'https://api.weixin.qq.com/cgi-bin/material/get_materialcount'.freeze
BATCHGET_MATERIAL = 'https://api.weixin.qq.com/cgi-bin/material/batchget_material'.freeze
ADD_MATERIAL = 'https://api.weixin.qq.com/cgi-bin/material/add_material'.freeze
ADD_NEWS = 'https://api.weixin.qq.com/cgi-bin/material/add_news'.freeze
DEL_MATERIAL = 'https://api.weixin.qq.com/cgi-bin/material/del_material'.freeze

#获取消息发送概况数据
DAY_MSG = 'https://api.weixin.qq.com/datacube/getupstreammsg'.freeze
#获取消息发送周数据
WEEK_MSG = 'https://api.weixin.qq.com/datacube/getupstreammsgweek'.freeze
#获取消息发送月数据
MONTH_MSG = 'https://api.weixin.qq.com/datacube/getupstreammsgmonth'.freeze
#获取消息发送分布数据
DAY_MSG_DIST = 'https://api.weixin.qq.com/datacube/getupstreammsgdist'.freeze
#获取消息发送分布周数据
WEEK_MSG_DIST = 'https://api.weixin.qq.com/datacube/getupstreammsgdistweek'.freeze
#获取消息发送分布月数据
MONTH_MSG_DIST = 'https://api.weixin.qq.com/datacube/getupstreammsgdistmonth'.freeze
#获取接口分析数据
INTERFACE_SUM = 'https://api.weixin.qq.com/datacube/getinterfacesummary'.freeze
#获取接口分析分时数据
INTERFACE_SUM_HOUR = 'https://api.weixin.qq.com/datacube/getinterfacesummaryhour'.freeze
#获取用户增减数据
USER_SUMMARY = 'https://api.weixin.qq.com/datacube/getusersummary'.freeze
#获取累计用户数据
USER_CUMULATE = 'https://api.weixin.qq.com/datacube/getusercumulate'.freeze

#获取用户列表
USER_LIST = 'https://api.weixin.qq.com/cgi-bin/user/get'.freeze
#获取用户基本信息
USER_INFO = 'https://api.weixin.qq.com/cgi-bin/user/info'.freeze
#批量获取用户基本信息(max=100)
USER_INFO_BATCH = 'https://api.weixin.qq.com/cgi-bin/user/info/batchget'.freeze
MOVE_GROUP = 'https://api.weixin.qq.com/cgi-bin/groups/members/update'.freeze
BATCH_MOVE_GROUP ='https://api.weixin.qq.com/cgi-bin/groups/members/batchupdate'.freeze
UPDATEREMARK = 'https://api.weixin.qq.com/cgi-bin/user/info/updateremark'.freeze
GROUP_LIST = 'https://api.weixin.qq.com/cgi-bin/groups/get'.freeze
CREATE_GROUP = 'https://api.weixin.qq.com/cgi-bin/groups/create'.freeze
UPDATE_GROUP_NAME = 'https://api.weixin.qq.com/cgi-bin/groups/update'.freeze
DEL_GROUP = 'https://api.weixin.qq.com/cgi-bin/groups/delete'.freeze
#一键上网的链接地址
# ACCESS_INTERNET_URL= 'http://10.1.234.78:9972/bjwxserver/wx/server'
ACCESS_INTERNET_URL= 'http://218.204.39.6:9972/bjwxserver/wx/server'.freeze

#用户默认组别
DEFAULT_GROUP_ID = 0
BLACK_GROUP_ID = 1

#"10.117.206.121" #
REDIS_PATH = '10.1.234.78'.freeze
