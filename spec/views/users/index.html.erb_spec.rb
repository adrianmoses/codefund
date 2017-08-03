require 'spec_helper'

describe "users/index" do
  before(:each) do
    assign(:users, [
      stub_model(User,
        :name => "Name",
        :email => "Email",
        :photo => "Photo",
        :is_student => false,
        :school => "School",
        :has_launched => false,
        :about_me => "MyText",
        :github => "Github"
      ),
      stub_model(User,
        :name => "Name",
        :email => "Email",
        :photo => "Photo",
        :is_student => false,
        :school => "School",
        :has_launched => false,
        :about_me => "MyText",
        :github => "Github"
      )
    ])
  end

  it "renders a list of users" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => "Email".to_s, :count => 2
    assert_select "tr>td", :text => "Photo".to_s, :count => 2
    assert_select "tr>td", :text => false.to_s, :count => 2
    assert_select "tr>td", :text => "School".to_s, :count => 2
    assert_select "tr>td", :text => false.to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "Github".to_s, :count => 2
  end
end
