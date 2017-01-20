require 'net/http'
class WxserverController < ApplicationController
  skip_filter :authenticate, :url_check

  def netauth

    WORKER_LOG.info "用户点击上网的链接，进入该ｎｅｔａｕｔｈ方法"
    paramStr=params[:paramStr]
    WORKER_LOG.info "微信认证链接携带参数params为#{paramStr}"

    getParamsStr = WXSERVER_NETAUTH + "?paramStr=" + paramStr

    WORKER_LOG.info "http get方法的参数为#{getParamsStr}"

    begin
      responseURL = httpGet(getParamsStr)
      WORKER_LOG.info "微信认证链接地址为#{responseURL}"

      if responseURL.nil?
        WORKER_LOG.info "微信认证报错，请查看相关日志"
      else
        redirect_to responseURL
      end
    rescue
      WORKER_LOG.error "http get方法调用微信认证接口异常．"
    end


  end

  private
  # http get请求处理方法
  def httpGet(url)
    uri = URI(url)
    Net::HTTP.get(uri)
  end

end
