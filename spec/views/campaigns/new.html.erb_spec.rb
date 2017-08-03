require 'spec_helper'

describe "campaigns/new" do
  before(:each) do
    assign(:campaign, stub_model(Campaign,
      :start_date => "",
      :end_date => "",
      :duration => "",
      :backers => "",
      :amount_funded => "",
      :user => ""
    ).as_new_record)
  end

  it "renders new campaign form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", campaigns_path, "post" do
      assert_select "input#campaign_start_date[name=?]", "campaign[start_date]"
      assert_select "input#campaign_end_date[name=?]", "campaign[end_date]"
      assert_select "input#campaign_duration[name=?]", "campaign[duration]"
      assert_select "input#campaign_backers[name=?]", "campaign[backers]"
      assert_select "input#campaign_amount_funded[name=?]", "campaign[amount_funded]"
      assert_select "input#campaign_user[name=?]", "campaign[user]"
    end
  end
end
