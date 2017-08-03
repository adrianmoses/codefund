require 'spec_helper'

describe "users/new" do
  before(:each) do
    assign(:user, stub_model(User,
      :name => "MyString",
      :email => "MyString",
      :photo => "MyString",
      :is_student => false,
      :school => "MyString",
      :has_launched => false,
      :about_me => "MyText",
      :github => "MyString"
    ).as_new_record)
  end

  it "renders new user form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", users_path, "post" do
      assert_select "input#user_name[name=?]", "user[name]"
      assert_select "input#user_email[name=?]", "user[email]"
      assert_select "input#user_photo[name=?]", "user[photo]"
      assert_select "input#user_is_student[name=?]", "user[is_student]"
      assert_select "input#user_school[name=?]", "user[school]"
      assert_select "input#user_has_launched[name=?]", "user[has_launched]"
      assert_select "textarea#user_about_me[name=?]", "user[about_me]"
      assert_select "input#user_github[name=?]", "user[github]"
    end
  end
end
