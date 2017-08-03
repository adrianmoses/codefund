Codefund WebApp
====================

This is the crowdfunding web application for codefund implemented in Ruby on Rails and Angularjs

The models
- User
- Campaign
- School


User
===============
 - name
 - email
 - photo
 - is_student
 (if candidate)
 - school
 - about me
 - code links
 - video
 - has_started

School
================
 - school name
 - tuition
 - is_online


Campaign
===============
 - start-date
 - end-date
 - duration
 - backers (user list)
 - amount funded
 - user profile (foreign key)

The database is MongoDB

Rails serves as a JSON API to Angular services

There are several pages
 - the landing page (later)
 - the account page (done)
 - the launch campaign page
 - the signup page (done)
 - the campaign page (done)
 - the discover page (done)
 - the about page (later)
 - the terms page (done)
 - the privacy page (done)
 - the contact page (later)
 - the fund page (done)

Landing page
==================

 - Intro startup
 - email sign up form
 - how it works
 - why people should signup

Account page
==================

 - Profile page
 - Add links, in personal info (if wanting to fund)
 - Start campaign button
 - Settings (password, address, email)

Launch Campaign Page
=====================

  - Form w/
  - Set amount (custom or full tuition)
  - Summary

Signup Page
===================
 - Sign up form
 - choose if backer or student (can change any time)

Campaign Page
====================
  - Profile public view
  - video
  - personal info
  - amount funded
  - days remaining
  - school to attend
  - list of backers
  - fund button to raise money

Discover Page
=====================
 - List Running campaigns
 - List completed campaigns
 - (Future release) search, categorization


About Page
=====================
 - go this on squarespace site

Terms Page
=====================
 - Need this

Privacy Page
=====================
 - Need this

Contact
=====================
 - User voice
 - email

Fund Page
====================
 - Could be modal
 - Amount person wants to fund
 - then credit card processing
 - then successful alert and add person to backer
 - then notify candidate that they have a backer



 cf-app WebApp!
=====================

---------------

This is an Angular.js App and is powered by [Boom Angular Generator](https://npmjs.org/package/generator-boom)



Installation
---------

Install the Boom Generator first.

```sh
    git clone [clone-url] app
    cd app
```

Install [Boom Angular Generator](https://npmjs.org/package/generator-boom)

```sh
    npm install -g generator-boom
```

Then install all develpment dependencies

```sh
    npm start
```

Finally, fire up the server

```
    gulp
```

----------
