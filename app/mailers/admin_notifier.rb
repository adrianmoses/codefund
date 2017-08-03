class AdminNotifier < ActionMailer::Base
  default from: "info@codefund.io"

  def send_pending_campaign_email(campaign)
    @campaign = campaign
    mail(:to => "adrian@codefund.io",
         :subject => 'Pending Campaign: ' + @campaign.username)
  end
end
