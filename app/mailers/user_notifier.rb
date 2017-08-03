class UserNotifier < ActionMailer::Base
  default from: "info@codefund.io"

  def send_signup_email(user)
    @user = user
    mail(:to => @user.email,
         :subject => 'Thanks for signup up for codefund!')
  end
end
