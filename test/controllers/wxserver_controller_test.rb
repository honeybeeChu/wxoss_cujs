require 'test_helper'

class WxserverControllerTest < ActionController::TestCase
  test "should get configrefresh" do
    get :configrefresh
    assert_response :success
  end

  test "should get health" do
    get :health
    assert_response :success
  end

end
