class CampaignNotifier < ActionMailer::Base
  default from: "info@codefund.io"

  def send_donation_alert_email(campaign, backer)
      @campaign = campaign
      @backer = backer
      mail(:to => @campaign.user.email,
           :subject => 'You received a donation for ' + @backer.pledge_amount + '!')
  end
end
