class UsersSerializer < ActiveModel::Serializer
  attributes :_id, :name, :email, :photo, :location, :is_student, :school, :has_launched, :about_me, :about_me_html, :password, :linkedin, :website, :github, :campaign_status
end
