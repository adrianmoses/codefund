class CampaignSerializer < ActiveModel::Serializer
  attributes :_id, :start_date, :end_date, :duration, :backers, :amount_funded, :user, :username, :goal, :school, :school_start_date, :video
end
