class WxUser < ActiveRecord::Base
  belongs_to :wx_official_account
  scope :current_account, ->(wx_official_account_id) { where(wx_official_account_id: wx_official_account_id) }

  def update_remark(wx_official_account, remark)
    result = wx_official_account.wx_post(UPDATEREMARK, {openid: self.openid, remark: remark})
    if result.is_ok?
      update(remark: remark)
    end
  end

  def move_group(wx_official_account, to_groupid)
    result = wx_official_account.wx_post(MOVE_GROUP, {openid: self.openid, to_groupid: to_groupid})
    if result.is_ok?
      update(groupid: to_groupid)
    end
  end

  class << self
    def move_to_default_group(wx_official_account, from_groupid)
      result = current_account(wx_official_account.id).where(groupid: from_groupid)
      openids = Array.new
      result.each do |wx_user|
        openids << wx_user.openid
      end
      batch_set_tag(wx_official_account, openids, from_groupid, DEFAULT_GROUP_ID)
    end

    def batch_set_tag(wx_official_account, openids, from_groupid=DEFAULT_GROUP_ID, to_groupid)
      return if openids.empty?
      result = wx_official_account.wx_post(BATCH_MOVE_GROUP, {openid_list: openids, to_groupid: to_groupid})
      if result.is_ok?
        transaction do
          where('wx_official_account_id = ? and openid in (?)', wx_official_account.id, openids).update_all(groupid: to_groupid)
          if from_groupid == DEFAULT_GROUP_ID
            WxUserGroup.update_counters([DEFAULT_GROUP_ID, wx_official_account.id], count: -openids.size)
            WxUserGroup.update_counters([to_groupid, wx_official_account.id], count: openids.size)
          else
            WxUserGroup.update_counters([DEFAULT_GROUP_ID, wx_official_account.id], count: openids.size)
            WxUserGroup.update_counters([from_groupid, wx_official_account.id], count: -openids.size)
          end
        end
      end
    end

    def wx_data_pull(wx_official_account)
      openid_arr = openlid_list(wx_official_account)
      transaction do
        delete_all(wx_official_account_id: wx_official_account.id)
        openid_arr.each do |openid|
          result = wx_official_account.wx_get(USER_INFO, {openid: openid, lang: 'zh_CN'})
          if result.is_ok?
            wx_user = WxUser.new(result.result)
            wx_user.nickname = emoji_filter(wx_user.nickname)
            wx_user.wx_official_account_id = wx_official_account.id
            wx_user.save
          end
        end
      end
    end

    private
    def openlid_list(wx_official_account, openid_arr = Array.new, next_openid = "")
      result = wx_official_account.wx_get(USER_LIST, {next_openid: next_openid})
      if result.is_ok?
        total = result.result[:total]
        count = result.result[:count]
        openid_arr += result.result[:data][:openid]
        next_openid = result.result[:next_openid]
        if total > 10000
          openlid_list(wx_official_account, openid_arr, next_openid)
        end
      end
      return openid_arr
    end

    def emoji_filter(str)
      pattern = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26B3-\u26BD\u26BF-\u26E1\u26E3-\u26FF\u2705\u270A\u270B\u2728\u274C\u274E\u2753\u2757\u2795\u2796\u2797\u27B0\u27BF\u{1F1E6}-\u{1F1FF}]/x
      str.gsub(pattern, '')
    end
  end

end
