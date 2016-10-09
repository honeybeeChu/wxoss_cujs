require 'test_helper'

class WxOfficialAccountsControllerTest < ActionController::TestCase
  setup do
    @wx_official_account = wx_official_accounts(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:wx_official_accounts)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create wx_official_account" do
    assert_difference('WxOfficialAccount.count') do
      post :create, wx_official_account: {  }
    end

    assert_redirected_to wx_official_account_path(assigns(:wx_official_account))
  end

  test "should show wx_official_account" do
    get :show, id: @wx_official_account
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @wx_official_account
    assert_response :success
  end

  test "should update wx_official_account" do
    patch :update, id: @wx_official_account, wx_official_account: {  }
    assert_redirected_to wx_official_account_path(assigns(:wx_official_account))
  end

  test "should destroy wx_official_account" do
    assert_difference('WxOfficialAccount.count', -1) do
      delete :destroy, id: @wx_official_account
    end

    assert_redirected_to wx_official_accounts_path
  end
end
