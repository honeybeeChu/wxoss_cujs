require 'sidekiq/web'

Rails.application.routes.draw do


  scope 'wxoss' do
    mount WeixinRailsMiddleware::Engine, at: "/"

    constraint = lambda { |request| !request.session[:admin].blank? }
    constraints constraint do
      mount Sidekiq::Web, at: '/sidekiq', as: :sidekiq
    end

    get "wx_official_accounts/getAccountList", to: 'wx_official_accounts#getAccountList'
    get "wx_official_accounts/setOfficialAccount2Session", to: 'wx_official_accounts#setOfficialAccount2Session'
    resources :wx_official_accounts do
      get 'get_resources', on: :member
      get 'get_users', on: :member
      resources :wx_auto_response

    end

    get 'welcome/index'
    post 'welcome/login'
    get 'welcome/getmenu'
    get 'welcome/logout'
    get 'wx_articles/resources'  => 'wx_resources#index'
    post 'wx_articles/resources'  => 'wx_resources#create'
    get 'wx_articles/resources/getimgdata' => 'wx_resources#getimgdata'
    post 'wx_articles/resources/create_group' => 'wx_resources#create_group'
    post 'wx_articles/resources/modify_img_group' => 'wx_resources#modify_img_group'
    post 'wx_articles/resources/modify_group' => 'wx_resources#modify_group'
    post 'wx_articles/resources/del_group' => 'wx_resources#del_group'
    post 'wx_articles/resources/rename' => 'wx_resources#rename'
    post 'wx_articles/resources/delete_image' => 'wx_resources#destroy'
    get 'wx_articles/edit' => 'wx_articles#edit'
    post 'wx_articles/delete' => 'wx_articles#destroy'
    resources :wx_articles

    post 'wx_users/get_fans_info'
    post 'wx_users/add_mark'
    post 'wx_users/create_group'
    post 'wx_users/rename_group'
    post 'wx_users/del_group'
    get 'wx_users/get_user_list'
    post 'wx_users/search'
    post 'wx_users/batch_set_tag'
    post 'wx_users/del_tag'
    post 'wx_users/set_black'
    post 'wx_users/cancle_black'
    post 'wx_users/fixgroupcnt'
    resources :wx_users
    get 'wx_msganalysis' => 'wx_msganalysis#index'
    get 'wx_msganalysis/keyword' => 'wx_msganalysis#keyword'
    get 'wx_msganalysis/fdevreport' => 'wx_msganalysis#fdevreport'
    get 'wx_interfaceanalysis' => 'wx_interfaceanalysis#index'
    get 'wx_useranalysis' => 'wx_useranalysis#index'

    # 刷新微信认证的数据系统
    get 'wxserver/netauth' => 'wxserver#netauth'


    resources :wx_batch_messages do
      get 'get_provinces_by_country_id', on: :collection
      get 'get_cities_by_province_id', on: :collection
      post 'batchSendMessage', on: :collection
      get 'batch_messages_history', on: :collection
      get 'delete_message', on: :collection
    end



    resources :wx_auto_responses do
      post 'update_response', on: :collection
      post 'create_response', on: :collection
      get 'delete_response', on: :collection
      post "create_key_response", on: :collection
      get "delete_wx_key_response", on: :collection
      post 'update_key_response', on: :collection
    end

    resources :wx_menus do
      # post 'update_menu', on: :collection
      post 'create_menu', on: :collection
      # get 'delete_menu', on: :collection
    end

    resources :wx_shake_activities do
      get 'redirect', on: :collection
      get 'screenshow', on: :collection
      get 'runway', on: :collection
      get 'get_userdata', on: :collection
      get 'awardlist', on: :collection
      get 'update_status', on: :collection
      get 'get_status', on: :collection
      post 'save_count', on: :collection
      get 'get_awardstatus', on: :collection
    end

    resources :wx_shake_managements do
      get 'prizelist', on: :collection
      post 'uploadpic', on: :collection
      post 'deletepic', on: :collection
    end

    resources :wx_wheel_activities do
      get 'redirect', on: :collection
      get 'wheel', on: :collection
      post 'update_info', on: :collection
      get 'query_record', on: :collection
    end

    resources :wx_wheel_managements do
      get 'prizelist', on: :collection
    end

    # get "getAccountList",to:'wx_auto_responses#getAccountList'


    # get 'go_auto_response', to: 'wx_auto_response#go_auto_response'


    # get 'search_wechat', to: 'wx_official_accounts#search_wechat'
  end
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
