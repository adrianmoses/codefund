require 'date'

class CampaignsController < ApplicationController
  before_action :set_campaign, only: [:edit, :destroy]

  # GET /campaigns
  # GET /campaigns.json
  def index
    @campaigns = Campaign.all
  end

  # GET /campaigns/1
  # GET /campaigns/1.json
  def show
    @campaign = Campaign.where(:username => params[:id]).first
  end

  # GET /campaigns/new
  def new
    @campaign = Campaign.new
  end

  # GET /campaigns/1/edit
  def edit
  end

  # POST /campaigns
  # POST /campaigns.json
  def create
    oid = BSON::ObjectId.from_string(campaign_params[:user])
    @user = User.find(oid)

    username = create_username(@user.name)
    new_params = campaign_params
    new_params[:username] = username
    new_params[:school_start_date] = DateTime.strptime(new_params[:school_start_date], "%m/%d/%Y")
    new_params[:school] = School.find(new_params[:school])

    @campaign = Campaign.new(new_params)
    @campaign.user = @user

    respond_to do |format|
      if @campaign.save
        @user.update_attributes(:campaign_status => "pending")
        AdminNotifier.send_pending_campaign_email(@campaign).deliver
        format.json { render :show, status: :created, location: @campaign }
      else
        format.json { render json: @campaign.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /campaigns/1
  # PATCH/PUT /campaigns/1.json
  def update
    respond_to do |format|
      @campaign = Campaign.where(:username => params[:id]).first

      backer_params = campaign_params
      backers = @campaign.backers
      @backer = Backer.new(backer_params)
      @backer.save
      backers.push(@backer)

      charge_card(backer_params)

      if @campaign.update_attributes(:backers => backers,
                                     :amount_funded => @campaign.amount_funded + @backer.pledge_amount)
        BackerNotifer.send_receipt_email(@backer).deliver
        CampaignNotifier.send_donate_alert_email(@campaign, @backer).deliver
        format.json { render :show, status: :ok, location: @campaign }
      else
        format.json { render json: @campaign.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /campaigns/1
  # DELETE /campaigns/1.json
  def destroy
    @campaign.destroy
    respond_to do |format|
      format.html { redirect_to campaigns_url, notice: 'Campaign was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_campaign
      @campaign = Campaign.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def campaign_params
      params.require(:campaign).permit(:start_date, :end_date, :duration, :backers, :amount_funded, :user, :username, :goal, :school, :school_start_date, :name, :email, :pledge_amount, :video, :token)
    end

    def create_username( name )
      # start with first names if not already created
      campaigns = Campaign.all
      usernames = campaigns.map{ | x | x.username }
      username = name.split(' ').first.downcase
      unless usernames.include?(username)
        username
      else
        username = name.downcase.split(' ').join('-')
        username
      end

    end

    def charge_card( backer_params )
      Stripe.api_key = "sk_live_4KG4dq1P4xx7ldTZTEFMGl4d"

      charge = Stripe::Charge.create(
        :amount => (backer_params[:pledge_amount] * 100).to_i,
        :currency => "usd",
        :card => backer_params[:token],
        :description => "Thank you for using codefund!"
      )
    end
end
