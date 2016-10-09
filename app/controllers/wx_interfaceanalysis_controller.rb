class WxInterfaceanalysisController < WeixinClientController
  layout 'wx_application'

  def index
    unless @current_wx_official_account.nil?
      sql ='wx_official_account_id = :wx_official_account_id and date >= :begin_date and date<= :end_date'
      query = Hash.new
      query[:wx_official_account_id] = @current_wx_official_account.id
      begin_date= params[:begin_date]
      end_date = params[:end_date]
      if begin_date.blank?||end_date.blank?
        end_date = format_time(Time.now - 1.day)
        begin_date = format_time(Time.now - 1.month)
      end
      query[:begin_date] = begin_date
      query[:end_date] = end_date
      result = nil
      params[:type] ||= 'daily'
      header = %W(时间 调用次数 失败次数 失败率 总共耗时(毫秒) 平均耗时(毫秒) 最大耗时(毫秒))
      begin_date_time = parse_datetime(query[:begin_date])
      end_date_time = parse_datetime(query[:end_date])
      case params[:type]
        when 'daily'
          result = WxInterfaceStat.where(sql, query).order(:date)
          export_data = daily_default_export_data(begin_date_time, end_date_time, header.size)
        when 'hour'
          result = WxInterfaceStatHour.where(sql, query).order(:date)
          header.insert(1, '小时')
          export_data = hourly_default_export_data(query[:begin_date], header.size)
      end
      list = Array.new
      insert_index = 3
      result.each do |item|
        temp = Hash.new
        temp[:date] = format_time(item.date)
        if params[:type] == 'hour'
          temp[:hour] = item.hour
          insert_index = 4
        end
        temp[:callback_count] = item.callback_count
        temp[:fail_count] = item.fail_count
        temp[:total_time_cost] = item.total_time_cost
        temp[:max_time_cost] = item.max_time_cost
        list << temp
        fail_range = ((item.fail_count.to_f/item.callback_count)*100).round(2)
        export_item = temp.values.insert(insert_index, "#{fail_range} %")
        average_cost = (item.total_time_cost.to_f/item.callback_count).round(2)
        export_item.insert(insert_index + 2, average_cost)
        if params[:type] == 'hour'
          hour_value = String.new(export_item[1].to_s)
          export_item[1] = hour_value.insert(-3, ':')
        end
        case params[:type]
          when 'daily'
            item_date_time = parse_datetime(temp[:date])
            update_index = (item_date_time - begin_date_time)/ (24 * 60 * 60)
            export_data[update_index] = export_item
          when 'hour'
            export_data[item.hour.to_i/100] = export_item
        end
      end
      @wx_interface_stats = Hash.new
      @wx_interface_stats[:list] = list
    end
    if params[:compare] == '1'
      query[:compare_begin_date]=params[:compare_begin_date]
      query[:compare_end_date]=params[:compare_end_date]
      compare_sql = 'wx_official_account_id = :wx_official_account_id and date >= :compare_begin_date and date<= :compare_end_date'
      compare_begin_date = parse_datetime(query[:compare_begin_date])
      compare_end_date = parse_datetime(query[:compare_end_date])
      case params[:type]
        when 'daily'
          compare_result = WxInterfaceStat.where(compare_sql, query).order(:date)
          compare_export_data = daily_default_export_data(compare_begin_date, compare_end_date, header.size)
        when 'hour'
          compare_result = WxInterfaceStatHour.where(compare_sql, query).order(:date)
          compare_export_data = hourly_default_export_data(query[:compare_begin_date], header.size)
      end
      compare_result.each do |item|
        compare_temp = Hash.new
        compare_temp[:date] = format_time(item.date)
        case params[:type]
          when 'hour'
            compare_temp[:hour] = item.hour.insert(-3, ':')
        end
        compare_temp[:callback_count] = item.callback_count
        compare_temp[:fail_count] = item.fail_count
        compare_temp[:total_time_cost] = item.total_time_cost
        compare_temp[:max_time_cost] = item.max_time_cost
        fail_range = ((item.fail_count.to_f/item.callback_count)*100).round(2)
        export_item = compare_temp.values.insert(insert_index, "#{fail_range} %")
        average_cost = (item.total_time_cost.to_f/item.callback_count).round(2)
        export_item.insert(insert_index + 2, average_cost)
        case params[:type]
          when 'daily'
            item_date_time = parse_datetime(compare_temp[:date])
            update_index = (item_date_time - compare_begin_date)/ (24 * 60 * 60)
            compare_export_data[update_index] = export_item
          when 'hour'
            compare_export_data[item.hour.to_i] = export_item
        end
      end
      temp = export_data.size
      temp.to_i().times { |e|
        export_data.insert(e*2+1, compare_export_data[e])
      }
    end
    if params[:download] == '1'
      filename = "public/download/#{Time.now.to_i}.xls"
      title = "接口分析（#{begin_date}至#{end_date}）"
      send_file Utils::Excel.export(filename, title, header, export_data), filename: 'interface_analysis.xls', type: 'application/xls'
    else
      respond_to do |format|
        format.html {
          render 'wx_analysis/interface'
        }
        format.json {
          render :json => {:base_resp => suc_msg, :daily_list => list, :daily_compare_list => [],
                           :hour_list => list, :hour_compare_list => []}, status => "200 ok"
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

  def daily_default_export_data(begin_date_time, end_date_time, header_size)
    total_days = (end_date_time - begin_date_time)/ (24 * 60 * 60) + 1
    current_date_time = begin_date_time
    return Array.new(total_days) { |e|
      temp = Array.new(header_size, '-')
      temp[0] = format_time(current_date_time)
      current_date_time+=(1.day)
      e = temp
    }
  end

  def hourly_default_export_data(current_date_time, header_size)
    return Array.new(24) { |e|
      temp = Array.new(header_size, '-')
      temp[0] = current_date_time
      temp[1] = e.to_s().concat(':00')
      e = temp
    }
  end
end
