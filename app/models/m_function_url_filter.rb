class MFunctionUrlFilter < ActiveRecord::Base
  def self.filter_list(funcid_arr)
    key = funcid_arr.join(',')
    result = Rails.cache.read(key)
    if result.nil?
      result = all.to_json
      Rails.cache.write(key, result)
    end
    JSON.load result
  end
end
