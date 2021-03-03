class PagesController < ApplicationController
  before_action :set_login_user
  before_action :ensure_login

  def ensure_login
    if @login_user == nil
      flash[:notice] = "ログインしてください"
      redirect_to("/")
    end
  end
  
  def home

    now = Time.new #今月Timeクラス
    weeks = ['日', '月', '火', '水', '木', '金', '土']
    weeks_english = ['son', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    this_year = now.year #今年
    this_month = now.month #今月
    today = now.day #今日
    this_beginning_month_day = now.beginning_of_month #月初
    this_end_month_day = now.end_of_month.day #月末
    next_ = now.next_month #翌月Timeクラス
    next_month = next_.month #翌月
    next_beginning_month_day = next_.beginning_of_month #翌月月初
    next_end_month_day = next_.end_of_month.day #翌月月末
    prev_ = now.prev_month #前月
    prev_end_month_day = prev_.end_of_month.day #前月月末
    if this_month == 12
      next_year = this_year + 1
    else
      next_year = this_year
    end
    
    saved = false
    File.open("./app/views/pages/saved.txt", "r") do |f|
      f.each_line do |line|
        if line.to_s.gsub(/\R/, "") == "saved"
          saved = true
        end
      end
    end

    @confirmed = false
    File.open("./app/views/pages/confirmed.txt", "r") do |f|
      f.each_line do |line|
        if line.to_s.gsub(/\R/, "") == "confirmed"
          @confirmed = true
        end
      end
    end

    month_changed = false
    if @login_user.user_id == 999 || @login_user.user_id == 9999  #ゲスト
      shift_all_next_month = GuestNextMonth.all.order(id: "ASC")
    else
      #shift_all_next_month = NextMonth.all.order(user_id: "ASC")

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

      shift_all_next_month = NextMonth.all.order(user_id: "ASC")

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

    if (today >= 20 && today <= 31 ) && !(@login_user.user_id == 999 || @login_user.user_id == 9999)
      #20日以降かつ編集が保存されていない場合
      if !saved 
        File.open("./app/views/pages/saved.txt", "w") do |f|
          f.puts("saved")
        end
        shift_all_next_month.each do |user_next_month|
          user_saved_next_month = SavedNextMonth.find_by(user_id: user_next_month.user_id)
          for day in 1..31
            day_sym = ("day" + day.to_s).to_sym
            user_saved_next_month[day_sym] = user_next_month[day_sym]
          end
          user_saved_next_month.save
        end
      end
    end

    #シフト情報インスタンス変数
    if @login_user.user_id == 999 || @login_user.user_id == 9999  #ゲスト
      @shift_this_month = GuestThisMonth.find_by(user_id: @login_user.user_id)
      @shift_next_month = GuestNextMonth.find_by(user_id: @login_user.user_id)
      @shift_saved_this_month = GuestThisMonth.find_by(user_id: @login_user.user_id)
    else  #従業員
      @shift_this_month = ThisMonth.find_by(user_id: @login_user.user_id)
      @shift_saved_this_month = SavedThisMonth.find_by(user_id: @login_user.user_id)
      @shift_saved_next_month = SavedNextMonth.find_by(user_id: @login_user.user_id)
      if @confirmed
        @shift_next_month = NextMonth.find_by(user_id: @login_user.user_id)
      elsif saved
        @shift_next_month = SavedNextMonth.find_by(user_id: @login_user.user_id)
      else
        @shift_next_month = NextMonth.find_by(user_id: @login_user.user_id)
      end
    end
    
    #日付情報インスタンス変数
    @month_info = {
      weeks: weeks,
      weeks_english: weeks_english,
      this_year: this_year,
      this_month: this_month,
      next_year: next_year,
      today: today,
      this_beginning_month_day: this_beginning_month_day,
      this_end_month_day: this_end_month_day,
      prev_end_month_day: prev_end_month_day,
      next_month: next_month,
      next_beginning_month_day: next_beginning_month_day,
      next_end_month_day: next_end_month_day
    }
    

    gon.login_user_id = @login_user.user_id
    gon.month_info = @month_info
    gon.next_end_month_day = next_end_month_day
    

    if @login_user.user_id == 1 || @login_user.user_id == 9999
      redirect_to action: :home_manager, month_info: @month_info, data: {"turbolinks" => false}
    end

    #人手不足情報インスタンス変数
    shortage = {}
    user_count = shift_all_next_month.length
    for i in 1..next_end_month_day do
      week = Date.new(next_year, next_month, i).wday
      if week == 0 || week == 6
        shortage_border = 3
      else
        shortage_border = 2
      end
      count = 0
      in_time = 0
      day_sym = ("day" + i.to_s).to_sym
      shift_one_day = shift_all_next_month.pluck(day_sym)
      shift_one_day.each do |one_shift_time|
        count += 1
        one_shift_time = one_shift_time.gsub(/\R/, "")
        if one_shift_time.match(/.*:.*/)
          in_time += 1
        end
        if count == user_count
          shortage[i.to_s.to_sym] = {'border': shortage_border, 'in_time': in_time}
        end
      end
    end

    gon.shortage = shortage
    gon.confirmed = false

    @submit_or_confirmed = "提出"

    if @login_user.user_id != 999
      File.open("./app/views/pages/confirmed.txt", "r") do |f|
        f.each_line do |line|
          if line.to_s.gsub(/\R/, "") == "confirmed"
            gon.confirmed = true
            @submit_or_confirmed = "表"
          end
        end
      end
    end
  end

  def home_manager
    if @login_user.user_id == 9999
      @shift_all_next_month = GuestNextMonth.all.order(id: "ASC")
      @shift_all_this_month = GuestThisMonth.all.order(id: "ASC")
      users = GuestUser.all.order(id: "ASC")
    else
      @shift_all_next_month = NextMonth.all.order(user_id: "ASC")
      @shift_all_this_month = ThisMonth.all.order(user_id: "ASC")
      users = User.all.order(user_id: "ASC")
    end
    
    gon.login_user_id = @login_user.user_id
    gon.employee_count = @shift_all_next_month.length
    gon.next_end_month_day = params[:month_info][:next_end_month_day]

    @user_id_name = {}
    
    users.each do |user|
      user_id_sym = user.user_id.to_s.to_sym
      @user_id_name[user_id_sym] = user.name
    end
    @month_info = params[:month_info]

    @edit_or_confirmed = "編集"
    @edit_or_confirm = "公開"
    @edit_or_confirm_modal = "シフトを確定して公開しますか？"
    @reload_message = "ページを再読み込みすると確定したシフト表が表示されます"

    if @login_user.user_id != 999
      File.open("./app/views/pages/confirmed.txt", "r") do |f|
        f.each_line do |line|
          if line.to_s.gsub(/\R/, "") == "confirmed"
            gon.confirmed = true
            @edit_or_confirmed = "表"
            @edit_or_confirm = "変更"
            @edit_or_confirm_modal = "シフトを変更しますか？"
            @reload_message = "ページを再読み込みすると変更されたシフト表が表示されます"
          end
        end
      end
    end
  end

  def submit_shift
    if @login_user.user_id != 999
      submit_user = NextMonth.find_by(user_id: @login_user.user_id)
      params[:submit_shift].each do |day, shift_time|
        submit_user[day.to_sym] = shift_time
        submit_user.save
      end
    end
    
    respond_to do |format|
      format.html 
      format.json {render action: :home, json: {judge: 'success!'}}
    end
  end

  def select_day
    login_user_id = @login_user.user_id

    confirmed = false
    @submit_or_confirmed = "提出"
    File.open("./app/views/pages/confirmed.txt", "r") do |f|
      f.each_line do |line|
        if line.to_s.gsub(/\R/, "") == "confirmed"
          confirmed = true
          @submit_or_confirmed = "表"
        end
      end
    end

    saved = false
    File.open("./app/views/pages/saved.txt", "r") do |f|
      f.each_line do |line|
        if line.to_s.gsub(/\R/, "") == "saved"
          saved = true
        end
      end
    end

    if @login_user.user_id == 999
      users = GuestNextMonth.where("user_id >= ? or user_id = ?", 5, 1).order(id: "ASC")
    else
      if confirmed
        users = NextMonth.all
      elsif saved
        users = SavedNextMonth.where("user_id >= ?", 5).order(user_id: "ASC")
      else
        users = NextMonth.where("user_id >= ?", 5).order(user_id: "ASC")
      end
    end

    
    
    users_shift = {}
    day_sym = params[:day].to_s.to_sym
    users.each do |user|
      user_id_sym = user.user_id.to_s.to_sym
      if @login_user.user_id == 999
        name = GuestUser.find_by(user_id: user.user_id).name
      else
        name = User.find_by(user_id: user.user_id).name
      end
      
      shift = user[day_sym]
      users_shift[user_id_sym] = {name: name, shift: shift}
    end
    respond_to do |format|
      format.html 
      format.json {render json: {
          login_user_id: login_user_id,
          users_shift: users_shift,
          confirmed: confirmed,
        }
      }
    end
  end

  def determine_day
    if @login_user.user_id == 999
      users = GuestThisMonth.all  #where.not("#{params[:day]} LIKE ?", "NULL")
    else
      users = ThisMonth.where.not("#{params[:day]} LIKE ?", "NULL")
    end
    
    users_shift = {}
    day_sym = params[:day].to_s.to_sym
    users.each do |user|
      user_id_sym = user.user_id.to_s.to_sym
      if @login_user.user_id == 999
        name = GuestUser.find_by(user_id: user.user_id).name
      else
        name = User.find_by(user_id: user.user_id).name
      end
      shift = user[day_sym]
      users_shift[user_id_sym] = {name: name, shift: shift}
    end
    respond_to do |format|
      format.html 
      format.json {render json: {
          users_shift: users_shift,
        }
      }
    end
  end

  def confirm_shift
    if @login_user.user_id != 9999
      File.open("./app/views/pages/confirmed.txt", "w") do |f|
        f.puts("confirmed")
      end
  
      employee = User.find_by(name: params[:confirm_shift]["name"])
      employee_id = employee.user_id.to_i
      confirm_user = NextMonth.find_by(user_id: employee_id)
      
      params[:confirm_shift]["shift"].each do |day, shift_time|
        confirm_user[day.to_sym] = shift_time
        confirm_user.save
      end
    end

    respond_to do |format|
      format.html 
      format.json {render action: :home, json: {
          result: "OK",
        }
      }
    end
  end

  def save_next_shift
    if @login_user.user_id != 9999
      File.open("./app/views/pages/saved.txt", "w") do |f|
        f.puts("saved")
      end
  
      employee = User.find_by(name: params[:save_next_shift]["name"])
      employee_id = employee.user_id.to_i
      save_user = NextMonth.find_by(user_id: employee_id)
      
      params[:save_next_shift]["shift"].each do |day, shift_time|
        save_user[day.to_sym] = shift_time
        save_user.save
      end
    end

    respond_to do |format|
      format.html 
      format.json {render action: :home, json: {
          result: "OK",
        }
      }
    end
  end

  def saved_day
    if @login_user.user_id == 999
      users = GuestThisMonth.all  #where.not("#{params[:day]} LIKE ?", "NULL")
    else
      #users = ThisMonth.where.not("#{params[:day]} LIKE ?", "NULL")
      users = SavedNextMonth.where.not("#{params[:day]} LIKE ?", "NULL")
    end
    
    users_shift = {}
    day_sym = params[:day].to_s.to_sym
    users.each do |user|
      user_id_sym = user.user_id.to_s.to_sym
      if @login_user.user_id == 999
        name = GuestUser.find_by(user_id: user.user_id).name
      else
        name = User.find_by(user_id: user.user_id).name
      end
      shift = user[day_sym]
      users_shift[user_id_sym] = {name: name, shift: shift}
    end
    respond_to do |format|
      format.html 
      format.json {render json: {
          users_shift: users_shift,
        }
      }
    end
  end

  def usage
  end

  def usage_manager
  end

  def inquiry
  end

  def send_inquiry
    File.open("./app/views/pages/inquiry.txt", "a") do |f|
      f.puts(params[:inquiry_message])
    end
  end

  def update_log
    
  end

  def change_password

  end

  def changed_password
    user = User.find_by(user_id: @login_user.user_id)
    if params[:new_password]  ==  params[:re_new_password]
      user.update(password: params[:new_password])
      user.save
      flash[:changed] = "パスワードを変更しました！"
    else
      flash[:error] = "確認用パスワードと一致しません"
    end

    redirect_to "/pages/change_password"
  end
end
