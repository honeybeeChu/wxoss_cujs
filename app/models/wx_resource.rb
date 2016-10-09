class WxResource < ActiveRecord::Base
  after_create :upload
  after_destroy :remove_file, :del_remote
  belongs_to :wx_official_account

  def setFile=(file)
    unless file.nil?
      @temp_file = file
      if @temp_file.size > 0
        self.resource_name = @temp_file.original_filename
        self.resource_size = @temp_file.size
        m= @temp_file.original_filename.to_s.match(/(^|\.)([^\.]+)$/)
        self.fomat = m[2].downcase
      end
    end
  end

  def upload
    if @temp_file && (@temp_file.size > 0)
      #应用缓冲的方法得到文件的内容并将其保存
      File.open(disk_file, 'wb') do |f|
        buffer = ''
        while (buffer = @temp_file.read(1024*2))
          f.write(buffer)
        end
      end
    end
  end

  def disk_file
    return "#{Rails.root}/public#{self.file_url}"
  end

  def set_file_url
    self.file_url= "/uploads/#{self.wx_official_account_id}/#{Time.now.to_f.round(2)}.#{self.fomat}"
  end

  def remove_file
    File.delete(disk_file) if File.exist?(disk_file)
  end

  def del_remote
    unless self.media_id.blank?
      current_wx_official_account = WxOfficialAccount.find(self.wx_official_account_id)
      current_wx_official_account.wx_post(DEL_MATERIAL, {:media_id => self.media_id})
    end
  end

  class << self
    def destroy_batch(ids)
      need_update = WxArticle.article_use(ids)
      menu_resource = WxMenu.resource_use(ids)
      response_content_resource = WxResponseContent.resource_use(ids)
      using = (menu_resource + response_content_resource).uniq
      need_update -= using
      if ids.size == using.size
        if ids.size > 1
          ret = 200501
        else
          ret = 200500
        end
      else
        ret = 0
        using_img_cnt = using.size
      end
      p [ids, need_update, menu_resource, response_content_resource, using]
      need_destroy = ids - using - need_update
      where('id in (?)', need_update).update_all(:deleted => true) unless need_update.empty?
      destroy(need_destroy) unless need_destroy.empty?
      return ret, using_img_cnt
    end

    def wx_data_pull(wx_official_account, image_count)
      result = wx_official_account.wx_post(BATCHGET_MATERIAL, {'type': 'image', 'offset': 0, 'count': image_count})
      if result.is_ok?
        transaction do
          delete_all(wx_official_account_id: wx_official_account.id)
          WxResourceGroup.delete_all(wx_official_account_id: wx_official_account.id)
          result.result[:item].each do |image|
            image_format = image[:url].split('=')[1]
            wx_resource = WxResource.new(wx_resource_group_id: 1, wx_official_account_id: wx_official_account.id,
                                         media_id: image[:media_id], resource_name: image[:name],
                                         resource_type: 2, fomat: image_format, wx_url: image[:url],
                                         updated_at: image[:update_time])
            wx_resource.set_file_url
            url = URI.parse(image[:url])
            http = Net::HTTP.new(url.host, 443)
            http.use_ssl = true
            http.verify_mode = OpenSSL::SSL::VERIFY_NONE
            request = Net::HTTP::Get.new(url.path)
            File.open(wx_resource.disk_file, 'wb') { |f|
              f.write(http.request(request).body)
            }
            wx_resource.resource_size = File.size?(wx_resource.disk_file)
            wx_resource.save
          end
          WxResourceGroup.clear(wx_official_account.id)
        end
      end
    end
  end
end
