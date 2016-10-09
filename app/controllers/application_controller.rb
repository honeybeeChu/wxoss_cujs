class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  before_filter :authenticate, :url_check
  layout nothing: true

  def authenticate
    if session[:admin].nil?
      respond_to do |format|
        format.html { redirect_to root_path, alert: "请登录后再使用后台系统" }
        format.json { render json: {code: 403, message: "请登录后再使用后台系统"}, status: :forbidden }
      end
    end
  end

  def url_check
    funcid_arr = Array.new
    session[:admin]['funclist'].each do |item|
      funcid_arr << item['funcid']
    end
    request_url = request.fullpath.split('?')[0]
    result = MFunctionUrlFilter.filter_list(funcid_arr)
    flag = false
    result.each do |function_url_filter|
      if (request_url.start_with?(function_url_filter['urlpattern']))
        flag = true
        @matchresult = function_url_filter['matchresult']
      end
    end
    unless flag
      redirect_to root_path
    end
  end
end
