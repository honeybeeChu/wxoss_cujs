class ChangeColnameEccodeidInWxofficalaccount < ActiveRecord::Migration
  def change
    rename_column(:wx_official_accounts, :reserved1,:wx_m_enterpriseclient_id )
  end
end
