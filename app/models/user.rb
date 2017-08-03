class User
  include Mongoid::Document
  field :name, type: String
  field :email, type: String
  field :password_hash, type: String
  field :location, type: String
  field :photo, type: String, default: "images/avatar.jpg"
  field :is_student, type: Mongoid::Boolean
  field :school, type: String
  field :has_launched, type: Mongoid::Boolean
  field :about_me, type: String, default: %q{A First Level Header
====================

A Second Level Header
---------------------

Now is the time for all good men to come to
the aid of their country. This is just a
regular paragraph.

The quick brown fox jumped over the lazy
dog's back.

### Header 3

> This is a blockquote.
>
> This is the second paragraph in the blockquote.
>
> ## This is an H2 in a blockquote

### Links

[Google][]

[Github](http://github.com)

[Twitter][]

[Google]: http://google.com "Google Search"
[Twitter]: http://twitter.com}
  field :about_me_html, type: String
  field :about_me_stripped, type: String
  field :campaign_status, type: String, default: "not created"
  field :campaign_url, type: String
  index({ email: 1 }, { unique: true, name: "email_index" })

  has_many :campaigns
end
