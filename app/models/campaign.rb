class Campaign
  include Mongoid::Document
  field :start_date, type: Time, default: Time.now
  field :end_date, type: Time, default: 30.days.from_now
  field :duration, type: Integer, default: 30
  field :username, type:String
  field :video, type:String, default: 'www.youtube.com/embed/3cjz5a1jHPU'
  field :backers, type: Array, default: []
  field :amount_funded, type: Float, default: 0
  field :goal, type: Float, default: 10000
  field :user, type: Moped
  field :school, type: Moped
  field :school_start_date, type: Time
  field :status, type: String, default: 'pending'
  index({ username: 1 }, { unique: true, name: "username_index" })

  belongs_to :user
  embeds_one :school
  embeds_many :backers
end
