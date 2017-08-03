json.array!(@campaigns) do |campaign|
  json.extract! campaign, :id, :start_date, :end_date, :duration, :backers, :amount_funded, :user, :school, :goal, :school_start_date, :username, :video
end
