class WxOfficialAccount < ActiveRecord::Base

  # validates_presence_of :wechat_name, :message => "wechat_name can not null"
  # validates_presence_of :original_id, :message => "original_id can not null"
  validates_presence_of :wechat_type, :message => "公众号类型不能为空"
  validates :original_id, uniqueness: {message: "%{value}已经存在"} #　原始Ｉｄ的唯一性check
  validates :wechat_account, uniqueness: {message: "%{value}已经存在"} #微信号的唯一性check
  validates :app_id, uniqueness: {message: "%{value}已经存在"} #微信号的唯一性check
  after_create :mk_resource_dir
  has_many :wx_auto_responses, :dependent => :destroy
  has_many :wx_key_responses, :dependent => :destroy
  has_many :wx_batch_send_messages, :dependent => :destroy
  # It will auto generate weixin token and secret
  include WeixinRailsMiddleware::AutoGenerateWeixinTokenSecretKey
  before_create do
    self.encoding_aes_key = generate_encoding_aes_key
  end
  validate :app_right_check, on: :create
  attr_reader :client

  has_many :wx_resources, :dependent => :destroy
  has_many :wx_user_groups, :dependent => :destroy
  has_many :wx_users, :dependent => :destroy
  has_many :wx_articles, :dependent => :destroy
  has_many :wx_resource_groups, :dependent => :destroy
  # 自定义菜单
  has_many :wx_menus, dependent: :destroy
  # 当前公众账号的所有父级菜单
  has_many :parent_menus, -> { includes(:sub_menus).where(parent_id: nil, is_show: true).order("sort").limit(3) },
           class_name: "WxMenu", foreign_key: :wx_official_account_id

  def wx_post(url, params)
    wx_log_info("当前公众号：#{self.wechat_name}")
    wx_log_info("接口请求地址：#{url}")
    wx_log_info("接口请求参数：#{params}")
    result = client.http_post(url, params, {}, WeixinAuthorize::CUSTOM_ENDPOINT)
    unless result.is_ok?
      wx_log_info("接口返回错误信息：#{result.full_error_message}")
    end
    return result
  end

  def wx_get(url, params={})
    wx_log_info("公众号名称：#{self.wechat_name}")
    wx_log_info("接口请求地址：#{url}")
    wx_log_info("接口请求参数：#{params}")
    result = client.http_get(url, params, WeixinAuthorize::CUSTOM_ENDPOINT)
    unless result.is_ok?
      wx_log_info("错误信息：#{result.full_error_message}")
    end
    return result
  end

  def wx_log_info(message)
    Utils::WxInvokeLogger.info message
  end

  def mk_resource_dir
    Dir.mkdir("public/uploads/#{self.id}")
  end

  def get_news_params_by_mediaid media_id
    _article = self.wx_articles.find(media_id)
    _img_url = self.wx_resources.find(_article.cover_file_id).wx_url
    return Hash["link_url" => _article.content_url, "pic_url" => _img_url, "title" => _article.title, "desc" => _article.digest]
  end

  # 公众号创建菜单方法的定义
  def build_menu
    Jbuilder.encode do |json|
      json.button (parent_menus) do |menu|
        json.name menu.name
        if menu.has_sub_menu?
          json.sub_button(menu.sub_menus) do |sub_menu|
            json.type sub_menu.type
            json.name sub_menu.name
            sub_menu.button_type(json)
          end
        else
          json.type menu.type
          menu.button_type(json)
        end
      end
    end
  end

  def client
    @client = WeixinAuthorize::Client.new(self.app_id, self.app_secret)
  end

  private
  def app_right_check
    @client = WeixinAuthorize::Client.new(self.app_id, self.app_secret)
    # 是合法的appId和appSecret
    if @client.is_valid?
      begin
        if self.expired_at.nil?|| self.expired_at.to_i < Time.now.to_i
          self.access_token = @client.custom_access_token = @client.get_access_token
          self.expired_at = Time.at(@client.expired_at)
        end
      rescue Exception => e
        if e.message.include? "APPID"
          errors.add(:msg_content, "不合法的app_id")
        elsif e.message.include? "appsecret"
          errors.add(:msg_content, "不合法的app_secret")
        end
      end
      # 不合法的appId和appSecret
    else
      errors.add(:msg_content, "appId和appSecret无效")
    end
  end

  def generate_encoding_aes_key
    WeiXinUniqueToken.generate(generator: :hex, size: 22)[1..43]
  end
end
