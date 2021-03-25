class AuthController < ApplicationController
  def login_form
    if session[:user_id]
      session[:user_id] = nil
    end
  end

  def login
    @user = User.find_by(user_id: params[:employee_num])
    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.user_id

      month_changed = false
      now = Time.new
      this_month = now.month #今月

      if @user.user_id != 999 && @user.user_id != 9999  #ゲスト
        File.open("./app/views/pages/month.txt", "r") do |f|
          f.each_line do |line|
            #月替り時
            unless line.to_s.gsub(/\R/, "") == this_month.to_s
              month_changed = true
    
              #ThisMonthの値をNextMonthに変えてNextMonthを白紙に
              NextMonth.all.order(user_id: "ASC").each do |user_next_month|
                user_this_month = ThisMonth.find_by(user_id: user_next_month.user_id)
                for day in 1..31
                  day_sym = ("day" + day.to_s).to_sym
                  user_this_month[day_sym] = user_next_month[day_sym]
                  user_next_month[day_sym] = ""
                end
                user_next_month.save
                user_this_month.save
              end
            end
          end
        end
  
        if month_changed
          File.open("./app/views/pages/month.txt", "w") do |f|
            f.puts(this_month)
          end
          File.open("./app/views/pages/confirmed.txt", "w") do |f|
            f.puts("not")
          end
          File.open("./app/views/pages/saved.txt", "w") do |f|
            f.puts("not")
          end
  
          user_saved_next_month = SavedNextMonth.all.order(user_id: "ASC")
          user_saved_next_month.each do |saved_next_month|
            user_saved_this_month = SavedThisMonth.find_by(user_id: saved_next_month.user_id)
            for day in 1..31
              day_sym = ("day" + day.to_s).to_sym
              user_saved_this_month[day_sym] = saved_next_month[day_sym]
            end
            user_saved_this_month.save
          end
        end
      end

      redirect_to "/pages/home"
    else
      flash[:error] = "担当者番号またはパスワードが違います"
      redirect_to "/auth/login"
    end
  end

  def logout
    session[:user_id] = nil
    flash[:logout] = "ログアウトしました"
    redirect_to action: :login_form
  end
end
