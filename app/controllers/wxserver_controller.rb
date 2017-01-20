# encoding: utf-8
require 'net/http'
require "open-uri"
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
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    if uri.scheme == 'https'
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      http.use_ssl = true
    end
    begin
      request = Net::HTTP::Get.new(uri.request_uri)
      request['Content-Type'] = 'application/json;charset=utf-8'
      request['User-Agent'] = 'Mozilla/5.0 (Windows NT 5.1; rv:29.0) Gecko/20100101 Firefox/29.0'
      request['X-ACL-TOKEN'] = 'xxx_token'
      #request.set_form_data(params)
      response = http.start { |http| http.request(request) }

      return response.body
    rescue => err
      return nil
    end
  end

end
