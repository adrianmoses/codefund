class Backer
  include Mongoid::Document
  field :name, type: String
  field :email, type: String
  field :token, type: String
  field :pledge_amount, type: Float
end
