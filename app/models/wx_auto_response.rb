class WxAutoResponse < ActiveRecord::Base
	belongs_to :wx_official_account


	def setFile=(file)
	    unless file.nil?
	      @temp_file = file
	      if @temp_file.size > 0

	        self.resource_name = @temp_file.original_filename
	        self.resource_size = @temp_file.size
	        m = @temp_file.original_filename.to_s.match(/(^|\.)([^\.]+)$/)
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
    return "public/uploads/#{self.wx_official_account_id}/#{self.resource_type}"
  end


end
