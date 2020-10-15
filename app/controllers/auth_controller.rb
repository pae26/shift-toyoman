class AuthController < ApplicationController
  def login_form
  end

  def login
    @user = User.find_by(user_id: params[:employee_num])
    if @user.pass == params[:password]
      session[:user_id] = @user.user_id
      redirect_to("/pages/home")
    end
  end

  def logout
    session[:user_id] =nil
    flash[:notice] = "ログアウトしました"
    redirect_to action: :login_form
  end
end
