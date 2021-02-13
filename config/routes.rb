Rails.application.routes.draw do
  get "/" => "auth#login_form"

  get "pages/home" => "pages#home"
  get "pages/home_manager" => "pages#home_manager"
  get "pages/usage"=> "pages#usage"
  get "pages/usage_manager"=> "pages#usage_manager"
  get "pages/inquiry" => "pages#inquiry"
  post "pages/send_inquiry" => "pages#send_inquiry"
  get "pages/update_log" => "pages#update_log"
  get "pages/change_password" => "pages#change_password"
  post "pages/change_password" => "pages#changed_password"
  
  get "auth/login" => "auth#login_form"
  post "auth/login" => "auth#login"
  get "auth/logout" => "auth#logout"

  post "/select_day" => "pages#select_day"
  post "/submit_shift" => "pages#submit_shift"
  post "/determine_day" => "pages#determine_day"
  post "/confirm_shift" => "pages#confirm_shift"
  post "/save_next_shift" => "pages#save_next_shift"
  post "/saved_day" => "pages#saved_day"
  
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end