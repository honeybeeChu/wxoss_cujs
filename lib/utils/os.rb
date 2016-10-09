module Utils
  class Os
    def self.get_curl_base_path
      case get_os_family
        when 'windows'
          "#{Rails.root}/vendor/curl/"
        else
          nil
      end
    end

    def self.get_os_family
      case RUBY_PLATFORM
        when /ix/i, /ux/i, /gnu/i,
            /sysv/i, /solaris/i,
            /sunos/i, /bsd/i
          'unix'
        when /win/i, /ming/i
          'windows'
        else
          'other'
      end
    end
  end
end