module Utils
  class WxInvokeLogger < Utils::Logger
    def self.file_name_noext
      'wx_invoke'
    end

    def format_message(severity, timestamp, progname, msg)
      "#{timestamp} -> #{severity} -> #{msg}\n"
    end
  end
end