class WxserverController < ApplicationController
  skip_filter :authenticate, :url_check

  def netauth

    WORKER_LOG.info "用户点击上网的链接，进入该ｎｅｔａｕｔｈ方法"
    paramStr=params[:paramStr]
    WORKER_LOG.info "微信认证链接携带参数params为#{paramStr}"
    responseURL = get(WXSERVER_NETAUTH + "?paramStr=" + paramStr)

    WORKER_LOG.info "微信认证链接地址为#{responseURL}"
    if responseURL.nil?
      WORKER_LOG.info "微信认证报错，请查看相关日志"
    else
      redirect_to responseURL
    end

  end


  private
  # http get请求处理方法
  def get(url)

    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Get.new(uri.request_uri)

    response = http.request(request)

  end

end
