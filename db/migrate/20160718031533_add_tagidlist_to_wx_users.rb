class AddTagidlistToWxUsers < ActiveRecord::Migration
  def change
    add_column :wx_users, :tagid_list, :string
  end
end
