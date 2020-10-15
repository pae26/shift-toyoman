class ApplicationController < ActionController::Base
    before_action :set_login_user

    def set_login_user
        @login_user = User.find_by(user_id: session[:user_id])
    end
end
