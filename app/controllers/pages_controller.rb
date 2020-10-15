class PagesController < ApplicationController
  before_action :set_login_user

  def home
    #シフト情報インスタンス変数
    @shift_this_month = ThisMonth.find_by(user_id: @login_user.user_id)
    @shift_next_month = NextMonth.find_by(user_id: @login_user.user_id)

    now = Time.new #今月Timeクラス
    weeks = ['日', '月', '火', '水', '木', '金', '土']
    this_year = now.year #今年
    this_month = now.month #今月
    today = now.day #今日
    this_beginning_month_day = now.beginning_of_month #月初
    this_end_month_day = now.end_of_month.day #月末
    next_ = now.next_month #翌月Timeクラス
    next_month = next_.month #翌月
    next_beginning_month_day = next_.beginning_of_month #翌月月初
    next_end_month_day = next_.end_of_month.day #翌月月末
    if this_month == 1
      prev_end_month_day = Time.new(this_year - 1, 12).end_of_month.day
    else
      prev_end_month_day = Time.new(this_year, this_month - 1).end_of_month.day
    end
    
    #日付情報インスタンス変数
    @month_info = {
      weeks: weeks,
      this_year: this_year,
      this_month: this_month,
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

    if @login_user.user_id == 1
      redirect_to action: :home_manager, month_info: @month_info
    end

  end

  def home_manager
    @shift_all_next_month = NextMonth.all.order(user_id: "ASC")
    @shift_all_this_month = ThisMonth.all.order(user_id: "ASC")
    @user_id_name = {}
    users = User.all.order(user_id: "ASC")
    
    users.each do |user|
      user_id_sym = user.user_id.to_s.to_sym
      @user_id_name[user_id_sym] = user.name
    end
    @month_info = params[:month_info]
  end


  def ajax
    return nil if params[:id] == ""
    @user = User.find_by(user_id: 7)

    respond_to do |format|
      format.html 
      format.json {render json: {id: @user.name}}
    end
  end

  def submit_shift
    return nil if params[:id] == ""
    submit_user = NextMonth.find_by(user_id: @login_user.user_id)
    params[:submit_shift].each do |day, shift_time|
      submit_user[day.to_sym] = shift_time
      submit_user.save
    end

    respond_to do |format|
      format.html 
      format.json {render json: {judge: 'success!'}}
    end
  end

  def select_day
    return nil if params[:id] == ""
    login_user_id = @login_user.user_id
    users = NextMonth.all  #where.not(user_id: @login_user.user_id)
    users_id = users.select('user_id')
    users_shift = {}
    day_sym = params[:day].to_s.to_sym
    users.each do |user|
      user_id_sym = user.user_id.to_s.to_sym
      name = User.find_by(user_id: user.user_id).name
      shift = user[day_sym]
      users_shift[user_id_sym] = {name: name, shift: shift}
    end
    respond_to do |format|
      format.html 
      format.json {render json: {
          login_user_id: login_user_id,
          users_shift: users_shift,
        }
      }
    end
  end

  def determine_day
    return nil if params[:id] == ""
    users = ThisMonth.where.not("#{params[:day]} LIKE ?", "NULL")
    users_id = users.select('user_id')
    users_shift = {}
    day_sym = params[:day].to_s.to_sym
    users.each do |user|
      user_id_sym = user.user_id.to_s.to_sym
      name = User.find_by(user_id: user.user_id).name
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

  def inquiry
  end
end
