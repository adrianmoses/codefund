class School
  include Mongoid::Document
  field :name, type: String
  field :location, type: String

  belongs_to :campaign
end
