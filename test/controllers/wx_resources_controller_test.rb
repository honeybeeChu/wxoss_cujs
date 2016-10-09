require 'test_helper'

class WxResourcesControllerTest < ActionController::TestCase
  setup do
    @wx_resource = wx_resources(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:wx_resources)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create wx_resource" do
    assert_difference('WxResource.count') do
      post :create, wx_resource: {  }
    end

    assert_redirected_to wx_resource_path(assigns(:wx_resource))
  end

  test "should show wx_resource" do
    get :show, id: @wx_resource
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @wx_resource
    assert_response :success
  end

  test "should update wx_resource" do
    patch :update, id: @wx_resource, wx_resource: {  }
    assert_redirected_to wx_resource_path(assigns(:wx_resource))
  end

  test "should destroy wx_resource" do
    assert_difference('WxResource.count', -1) do
      delete :destroy, id: @wx_resource
    end

    assert_redirected_to wx_resources_path
  end
end
