json.array!(@users) do |user|
  json.extract! user, :name, :email, :photo, :is_student, :school, :has_launched, :about_me, :about_me_html, :about_me_stripped, :campaign_status, :campaign_url
end
