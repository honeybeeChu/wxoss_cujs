module Utils
  class Excel
    def self.export(filename, title, header, data)
      book = Spreadsheet::Workbook.new
      sheet = book.create_worksheet
      caption_format = Spreadsheet::Format.new(:name => '宋体', :size => 16, :align => :center,
                                               :vertical_align => :middle)
      caption = sheet.row(0)
      caption.height = 30
      caption.default_format = caption_format
      sheet.merge_cells 0, 0, 0, 10
      caption[0] = title
      thead = sheet.row(1)
      thead_format = Spreadsheet::Format.new(:name => '宋体', :size => 12, :align => :center,
                                             :vertical_align => :middle, :right => :thin, :bottom => :thin)
      thead.height = 33
      header.each_with_index { |item, index|
        sheet.column(index).width = 18
        thead.set_format index, thead_format
        thead[index]= item
      }
      body_format = Spreadsheet::Format.new(:name => '宋体', :size => 10, :align => :center,
                                            :vertical_align => :middle, :right => :thin, :bottom => :thin)
      data.each_with_index { |item, index|
        sheet.row(index + 2).height = 23
        item.each_with_index { |sub_item, sub_index|
          sheet.column(sub_index).width = 18
          sheet.row(index + 2).set_format sub_index, body_format
          sheet.row(index + 2).push sub_item
        }
      }
      book.write filename
      return filename
    end
  end
end