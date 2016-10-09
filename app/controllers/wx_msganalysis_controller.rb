class WxMsganalysisController < WeixinClientController
  layout "wx_application"

  def index
    unless @current_wx_official_account.nil?
      sql ='wx_official_account_id = :wx_official_account_id and cycle = :cycle and date >= :begin_date and date<= :end_date'
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
      header = %w(时间 消息发送人数 消息发送次数 人均发送次数)
      begin_date_time = parse_datetime(query[:begin_date])
      end_date_time = parse_datetime(query[:end_date])
      case params[:type]
        when 'daily'
          query[:cycle] = 1
          export_data = daily_default_export_data(begin_date_time, end_date_time, header.size)
        when 'weekly'
          query[:cycle] = 2
          export_data = weekly_default_export_data(begin_date_time, end_date_time, header.size)
        when 'monthly'
          query[:cycle] = 3
          export_data = monthly_default_export_data(begin_date_time, end_date_time, header.size)
      end

      result = WxMsgStat.where(sql, query).order(:date)
      msg_data = Array.new
      result.each do |item|
        temp = Hash.new
        temp[:date] = format_time(item.date)
        temp[:user] = item.user
        temp[:count] = item.count
        msg_data << temp
        if params[:download] == '1'
          export_item = temp.values.push((item.count.to_f/item.user).round(1))

          item_date_time = parse_datetime(temp[:date])
          update_index = ((item_date_time - begin_date_time)/ (24 * 60 * 60)).to_i
          case params[:type]
            when 'weekly'
              update_index = update_index / 7
            when 'monthly'
              update_index = update_index / 30
          end
          export_data[update_index] = export_item
        end
      end
      dist_result = WxMsgdistStat.where(sql, query).order(:date)
      dist_data = Array.new
      dist_result.each do |item|
        temp = Hash.new
        temp[:date] = format_time(item.date)
        temp[:count_interval] = item.count_interval
        temp[:user] = item.user
        dist_data << temp
      end
      @wx_msg_stats = Hash.new
      @wx_msg_stats[:data] = {:msg_data => msg_data, :dist_data => dist_data}
      @wx_msg_stats[:filter] = {:type => params[:type], :begin_date => params[:begin_date], :end_date => params[:end_date]}
      @wx_msg_stats[:total_count] = 0
    end
    if params[:compare] == '1'
      query[:compare_begin_date]=params[:compare_begin_date]
      query[:compare_end_date]=params[:compare_end_date]
      compare_sql = 'wx_official_account_id = :wx_official_account_id and cycle = :cycle and date >= :compare_begin_date and date<= :compare_end_date'

      compare_begin_date = parse_datetime(query[:compare_begin_date])
      compare_end_date = parse_datetime(query[:compare_end_date])
      case params[:type]
        when 'daily'
          compare_export_data = daily_default_export_data(compare_begin_date, compare_end_date, header.size)
        when 'weekly'
          compare_export_data = weekly_default_export_data(compare_begin_date, compare_end_date, header.size)
        when 'monthly'
          compare_export_data = monthly_default_export_data(compare_begin_date, compare_end_date, header.size)
      end
      result = WxMsgStat.where(compare_sql, query).order(:date)
      result.each do |item|
        compare_temp = Hash.new
        compare_temp[:date] = format_time(item.date)
        compare_temp[:user] = item.user
        compare_temp[:count] = item.count
        export_item = compare_temp.values.push((item.count.to_f/item.user).round(1))
        item_date_time = parse_datetime(compare_temp[:date])
        update_index = ((item_date_time - compare_begin_date)/ (24 * 60 * 60)).to_i
        case params[:type]
          when 'weekly'
            update_index = update_index / 7
          when 'monthly'
            update_index = update_index / 30
        end
        compare_export_data[update_index] = export_item
      end
      temp = export_data.size - compare_export_data.size
      if temp > 0
        temp.to_i.times {
          compare_export_data << Array.new(header.size, '-')
        }
      else
        temp.abs.to_i.times {
          export_data << Array.new(header.size, '-')
        }
      end

      export_data.size.to_i.times { |e|
        export_data.insert(e*2+1, compare_export_data[e])
      }
    end
    if params[:download] == '1'
      filename = "public/download/#{Time.now.to_i}.xls"
      title = "消息分析（#{begin_date}至#{end_date}）"
      send_file Utils::Excel.export(filename, title, header, export_data), filename: 'message_analysis.xls', type: 'application/xls'
    else
      respond_to do |format|
        format.html {
          render 'wx_analysis/message'
        }
        format.json {
          render :json => {:base_resp => suc_msg, :dist_list => dist_data, :list => msg_data, :compare_list => []}, status => "200 ok"
        }
      end
    end
  end

  def keyword
    render 'wx_analysis/keyword'
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

  def weekly_default_export_data(begin_date_time, end_date_time, header_size)
    total_days = (end_date_time - begin_date_time)/ (24 * 60 * 60) + 1
    current_date_time = begin_date_time
    weeks = Array.new
    total_days.to_i().times { |e|
      if (current_date_time.wday == 1)
        weeks << format_time(current_date_time)
      end
      current_date_time+=(1.day)
    }

    return Array.new(weeks.size) { |e|
      temp = Array.new(header_size, '-')
      temp[0] = weeks[e]
      current_date_time+=(1.day)
      e = temp
    }
  end

  def monthly_default_export_data(begin_date_time, end_date_time, header_size)
    total_days = (end_date_time - begin_date_time)/ (24 * 60 * 60) + 1
    current_date_time = begin_date_time
    weeks = Array.new
    total_days.to_i().times { |e|
      if (current_date_time.day == 1)
        weeks << format_time(current_date_time)
      end
      current_date_time+=(1.day)
    }

    return Array.new(weeks.size) { |e|
      temp = Array.new(header_size, '-')
      temp[0] = format_time(current_date_time)
      current_date_time+=(1.day)
      e = temp
    }
  end

end
