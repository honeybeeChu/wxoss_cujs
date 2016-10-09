class WxUserGroup < ActiveRecord::Base
  self.primary_keys = :groupid, :wx_official_account_id
  belongs_to :wx_official_account

  def rename_group(wx_official_account, new_group_name)
    result = wx_official_account.wx_post(UPDATE_GROUP_NAME, {group: {id: groupid, name: new_group_name}})
    if result.is_ok?
      update(:name => new_group_name)
    end
  end

  def del_group(wx_official_account)
    result = wx_official_account.wx_post(DEL_GROUP, {group: {id: groupid}})
    if result.is_ok?
      destroy
      WxUser.move_to_default_group(wx_official_account, groupid)
    end
  end

  def groupid
    return self.id[0]
  end

  class << self

    def groups(wx_official_account_id, prefix = 'group_')
      user_groups = where(wx_official_account_id: wx_official_account_id)
      wx_user_groups = Array.new
      total_num = 0
      user_groups.each do |wx_user_group|
        wx_user_group_hash = Hash.new
        wx_user_group_hash["#{prefix}id"] = wx_user_group.groupid
        wx_user_group_hash["#{prefix}name"] = wx_user_group.name
        wx_user_group_hash["#{prefix}cnt"] = wx_user_group.count
        total_num += wx_user_group.count
        wx_user_group_hash["#{prefix}create_time"] = wx_user_group.create_time.to_i
        wx_user_groups << wx_user_group_hash
      end
      return wx_user_groups, total_num
    end

    def wx_data_pull(wx_official_account)
      result = wx_official_account.wx_get(GROUP_LIST)
      if result.is_ok?
        transaction do
          delete_all(wx_official_account_id: wx_official_account.id)
          result.result[:groups].each do |group|
            save_group(group, wx_official_account.id)
          end
        end
      end
    end

    def create_group(wx_official_account, name)
      result = wx_official_account.wx_post(CREATE_GROUP, {group: {name: name}})
      if result.is_ok?
        group = result.result[:group]
        add_groupid = group[:id]
        save_group(group, wx_official_account.id)
      end
      return add_groupid
    end

    private
    def save_group(group, wx_official_account_id)
      temp = Array.new
      temp << group[:id]
      temp << wx_official_account_id
      group[:id] = temp
      group[:create_time] = Time.now
      wx_user_group = new(group)
      wx_user_group.save
    end
  end
end
