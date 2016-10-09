class WxUseranalysisController < WeixinClientController
  layout "wx_application"

  def index
    unless @current_wx_official_account.nil?
      sql ='wx_official_account_id = :wx_official_account_id and date >= :begin_date and date<= :end_date and user_source = :user_source'
      query = Hash.new
      query[:wx_official_account_id] = @current_wx_official_account.id
      begin_date= params[:begin_date]
      end_date = params[:end_date]
      if begin_date.blank?||end_date.blank?
        end_date = (Time.now - 1.day).strftime("%Y-%m-%d")
        begin_date = ((Time.now - 1.day) - 1.month).strftime("%Y-%m-%d")
      end
      query[:begin_date] = begin_date
      query[:end_date] = end_date
      result = nil
      params[:source] ||= "99999999"
      query[:user_source] = params[:source]
      result = WxUserStat.where(sql, query).order(:date)
      list = Array.new
      export_data = Array.new
      user_data = Array.new
      result.each do |item|
        temp = Hash.new
        temp[:date] = item.date.strftime("%Y-%m-%d")
        temp[:new_user] = item.new_user
        temp[:cancel_user] = item.cancel_user
        temp[:netgain_user] = item.new_user-item.cancel_user
        temp[:cumulate_user] = item.cumulate_user
        user_data << temp
        if params[:download] == '1'
          export_data << temp.values
        end
      end
      list_tmp = Hash.new
      list_tmp[:user_source] = params[:source]
      list_tmp[:list] = user_data
      list << list_tmp

      category_list = Array.new
      source_data = params[:source].split(",")
      if source_data.size == 1
        category_list << list_tmp
      else
        source_data.each do |item|
          query[:user_source] = item
          result = WxUserStat.where(sql, query).order(:date)
          list_data = Array.new
          result.each do |item|
            temp = Hash.new
            temp[:date] = item.date.strftime("%Y-%m-%d")
            temp[:new_user] = item.new_user
            temp[:cancel_user] = item.cancel_user
            temp[:netgain_user] = item.new_user-item.cancel_user
            temp[:cumulate_user] = item.cumulate_user
            list_data << temp
          end
          category_tmp = Hash.new
          category_tmp[:user_source] = item
          category_tmp[:list] = list_data
          category_list << category_tmp
        end
      end
      @wx_user_stats = Hash.new
      @wx_user_stats[:list] = list
    end
    if params[:compare] == '1'
      query[:compare_begin_date]=params[:compare_begin_date]
      query[:compare_end_date]=params[:compare_end_date]
      compare_sql = 'wx_official_account_id = :wx_official_account_id and date >= :compare_begin_date and date<= :compare_end_date and user_source = :user_source'
      result = WxUserStat.where(compare_sql, query).order(:date)
      index = 1
      result.each do |item|
        compare_temp = Hash.new
        compare_temp[:date] = item.date.strftime("%Y-%m-%d")
        compare_temp[:new_user] = item.new_user
        compare_temp[:cancel_user] = item.cancel_user
        compare_temp[:netgain_user] = item.new_user-item.cancel_user
        compare_temp[:cumulate_user] = item.cumulate_user
        export_data.insert(index, compare_temp.values)
        index += 2
      end
    end
    if params[:download] == '1'
      filename = "public/download/#{Time.now.to_i}.xls"
      title = "用户分析（#{begin_date}至#{end_date}）"
      header = %w(时间 新关注人数 取消关注人数 净增关注人数 累积关注人数)
      send_file Utils::Excel.export(filename, title, header, export_data), filename: 'user_analysis.xls', type: 'application/xls'
    else
      respond_to do |format|
        format.html {
          render 'wx_analysis/user'
        }
        format.json {
          render :json => {:base_resp => suc_msg, :category_list => category_list}, status => "200 ok"
        }
      end
    end
  end

  def fdevreport
    render :json => {:base_resp => suc_msg}
  end

  private
  def suc_msg
    base_resp = Hash.new
    base_resp[:err_msg] = 'ok'
    base_resp[:ret] = 0
    return base_resp
  end

end
