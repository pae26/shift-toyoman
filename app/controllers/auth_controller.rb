class AuthController < ApplicationController
  def login_form
    
  end

  def login
    @user = User.find_by(user_id: params[:employee_num])
    if @user.pass == params[:password]
      session[:user_id] = @user.user_id
      redirect_to "/pages/home"
    else
      flash[:error] = "従業員番号またはパスワードが違います"
      redirect_to "/auth/login"
    end
  end

  def logout
    session[:user_id] =nil
    flash[:logout] = "ログアウトしました"
    redirect_to action: :login_form
  end
end
