require 'test_helper'

class AuthControllerTest < ActionDispatch::IntegrationTest
  test "should get login_form" do
    get auth_login_form_url
    assert_response :success
  end

end
