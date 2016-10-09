json.array!(@current_wx_official_account) do |wx_official_account|
  json.extract! wx_official_account, :id
  json.url wx_official_account_url(wx_official_account, format: :json)
end
