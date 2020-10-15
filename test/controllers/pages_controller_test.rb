require 'test_helper'

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get home" do
    get pages_home_url
    assert_response :success
  end

  test "should get inquiry" do
    get pages_inquiry_url
    assert_response :success
  end

  test "should get usage" do
    get pages_usage_url
    assert_response :success
  end

end
