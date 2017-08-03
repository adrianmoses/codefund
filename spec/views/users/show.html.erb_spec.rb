require 'spec_helper'

describe "users/show" do
  before(:each) do
    @user = assign(:user, stub_model(User,
      :name => "Name",
      :email => "Email",
      :photo => "Photo",
      :is_student => false,
      :school => "School",
      :has_launched => false,
      :about_me => "MyText",
      :github => "Github"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Name/)
    rendered.should match(/Email/)
    rendered.should match(/Photo/)
    rendered.should match(/false/)
    rendered.should match(/School/)
    rendered.should match(/false/)
    rendered.should match(/MyText/)
    rendered.should match(/Github/)
  end
end
