class BackerNotifier < ActionMailer::Base
  default from: "info@codefund.io"

  def send_receipt_email(backer)
      @backer = backer
      mail(:to => @backer.email,
           :subject => 'Thanks for donating!')
  end
end
