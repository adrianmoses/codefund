class AdminController < ApplicationController

  http_basic_authenticate_with :name => "codefund", :password => "danasaur 31 ?"

  def index
    @campaigns = Campaign.all
    @campaigns.each do |campaign|
      campaign.user.update_attributes(
        :campaign_status => campaign.status,
        :campaign_url => '/campaign/' + campaign.username
      )
    end
  end

  def show
    @campaign = Campaign.find(params[:id])
    respond_to do |format|
      format.json { render json: @campaign, status: :ok}
    end
  end


  def approve
    @campaign = Campaign.where(:username => params[:id]).first
    @campaign.update_attributes(:status => 'approved')
    @campaign.user.update_attributes(
      :campaign_status => 'approved',
      :campaign_url =>'/campaign/' + @campaign.username)
    if @campaign.save
       redirect_to action: "index"
    end
  end

end
