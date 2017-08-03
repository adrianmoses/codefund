json.(@campaign, :_id, :start_date, :end_date, :duration, :username, :backers, :amount_funded, :goal, :school, :school_start_date, :video)
json.user do |json|
  json.about_me @campaign.user.about_me
  json.about_me_html @campaign.user.about_me_html
  json.about_me_stripped @campaign.user.about_me_stripped
  json.campaign_status @campaign.user.campaign_status
  json.name @campaign.user.name
  json.photo @campaign.user.photo
  json.school @campaign.user.school
end

json.backers @campaign.backers do |backer|
  json.name backer.name
  json.pledge_amount backer.pledge_amount
end
