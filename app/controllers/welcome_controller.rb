require "rexml/document"
include REXML
class WelcomeController < ApplicationController
  skip_before_filter :authenticate, :url_check
  LOGINTYPE_OPERATOR=0
  LOGINTYPE_ENTERPRISE=1

  def index
  end

  def login
    username=params[:userName]
    password=params[:passWord]
    rescode=-1
    #校验
    if username == nil
      render json: {"result" => rescode}
    elsif password == nil
      render json: {"result" => rescode}
    else

      userip=request.headers['X-Real-IP']
      if userip == nil
        userip = request.remote_ip
      end

      #发送认证请求
      serialno=rand(999999)
      xml="<?xml version='1.0' encoding='UTF-8'?><AdminAuth><serialno>"+serialno.to_s+"</serialno><username>"+
          username+"</username><password>"+password+"</password><systemid>"+SYSTEM_ID+"</systemid><userip>"+userip+"</userip></AdminAuth>";
      #puts("#{xml}")
      resultxml=httpxmlpost(AIUAS_URL, xml)
      # puts("#{resultxml}")
      result=to_xml(resultxml)
      #puts(result)
      rescode=result.fetch("resultcode")
      account_id=nil
      if rescode.eql?("0")
        eccode=result.fetch("eccode", nil)
        logintype=LOGINTYPE_OPERATOR
        if !eccode.nil? && !eccode.empty?
          logintype=LOGINTYPE_ENTERPRISE
          accountEccode=WxAccountEccode.find_by_eccode(eccode)
          if accountEccode.nil?
            rescode="-1"
            desc="未找可以管理的公众号"
            render json: {"result" => rescode, "desc" => result.fetch("resultdesc")}
          else
            account_id=accountEccode.wx_official_account_id
          end
        end
        funcliststr=result.fetch("funclist")
        funclist=JSON.parse(funcliststr)

        menu=MFunction.getMeaus(funclist)
        info=wx_official_accounts_path
        admin=Hash.new
        admin.store("adminname", username)
        admin.store("password", password)
        admin.store("logintype", logintype)
        if logintype == LOGINTYPE_ENTERPRISE
          admin.store("account_id", account_id)
          session[:current_official_account_id]=account_id
          info=wx_auto_responses_path
        end
        admin.store("funclist", funclist)
        admin.store("menu", menu)
        session[:admin]=admin
        render json: {"result" => rescode, "desc" => result.fetch("resultdesc"), "info" => info}
      else
        render json: {"result" => rescode, "desc" => result.fetch("resultdesc")}
      end
    end
  end

  def getmenu
    admin=session[:admin]
    rescode=-1
    if admin.nil?
      render json: {"result" => rescode, "desc" => "session已失效"}
    else
      rescode=0
      logintype=admin.fetch("logintype")
      res={"result" => rescode, "desc" => "获取菜单成功", "menu" => admin.fetch("menu")}
      if logintype == LOGINTYPE_ENTERPRISE
        res.store("account_id", admin.fetch("account_id"))
      end
      render json: res
    end
  end

  def logout
    session.clear
    redirect_to root_path
  end

  private
  def httpxmlpost(url, data)
    req_headers= {
        'Content-Type' => 'text/xml; charset=utf-8'
    }
    uri = URI.parse(url)
    client = HTTPClient.new
    client.send_timeout=2
    client.connect_timeout=2
    res= client.post(uri, data, req_headers)
    return res.content
  end

  def to_xml(xml)

    doc = REXML::Document.new(xml)
    root=doc.root
    xmlobj=Hash.new
    root.elements.each { |re|
      xmlobj.store(re.name, re.text)
    }
    return xmlobj
  end

end
