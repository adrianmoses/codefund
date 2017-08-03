
/*================================================================
=>                  App = cfApp
==================================================================*/
/*global angular*/

//var app = angular.module('cfApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ngAnimate', 'ui.bootstrap']);
angular.module('cfApp.controllers', ['ngCookies']);
angular.module('cfApp.services', ['ngResource']);
angular.module('cfApp.factories', ['ngResource']);
angular.module('cfApp.filters', []);
angular.module('cfApp.directives', []);

var app = angular.module('cfApp', [
	'cfApp.controllers',
	'cfApp.services',
	'cfApp.factories',
	'cfApp.filters',
	'cfApp.directives',
	'ngRoute',
	'ngAnimate',
	'ngSanitize',
	'ui.bootstrap',
	'angularFileUpload'
]);


app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
	'use strict';
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name="csrf-token"]').attr('content');
	$locationProvider.html5Mode(true);
	$routeProvider
		.when('/', {
			templateUrl: '/templates/home.html',
			redirectTo: function(current, path, search){
          if(search.goto){
            // if we were passed in a search param, and it has a path
            // to redirect to, then redirect to that path
            return "/" + search.goto
          }
          else{
            // else just redirect back to this location
            // angular is smart enough to only do this once.
            return "/"
          }
        }
		})
		.when('/signin', {
			templateUrl: '/templates/signin.html',
			controller: 'SigninController'
		})
		.when('/signup', {
		  templateUrl: '/templates/coming-soon.html',
		})
		/*.when('/new-student', {
		  templateUrl: 'templates/signup.html',
			controller: 'SignupController'
		})*/
		.when('/account', {
			templateUrl: '/templates/account.html',
			controller: 'AccountController'
		})
		.when('/discover', {
			templateUrl: '/templates/discover.html',
			controller: 'DiscoverController'
		})
		.when('/launch', {
		  templateUrl: '/templates/launch.html',
			controller: 'LaunchController'
		})
		.when('/campaign/:username', {
		  templateUrl: '/templates/campaign.html',
			controller: 'CampaignController'
		})
		.when('/campaign/:username/donate', {
			templateUrl: '/templates/pledge.html',
			controller: 'PledgeController'
		})
		.when('/terms', {
			templateUrl: '/templates/terms.html'
		})
		.when('/privacy', {
			templateUrl: '/templates/privacy.html'
		})
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.hashPrefix('!');

	// This is required for Browser Sync to work poperly
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);


/*================================================================
=>                  cfApp App Run()
==================================================================*/

app.run(['$rootScope', '$location', function ($rootScope, $location) {

	'use strict';

	console.log('Angular.js run() function...');
	var history = [];

  $rootScope.$on('$routeChangeSuccess', function() {
      history.push($location.$$path);
  });

  $rootScope.back = function () {
      var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/account";
      $location.path(prevUrl);
  };
}]);




/* ---> Do not delete this comment (Values) <--- */

/* ---> Do not delete this comment (Constants) <--- */

'use strict';

angular.module('cfApp.controllers')
  .controller('AccountController', ['$scope', '$location', '$timeout', 'Session', 'UserFactory', 'alertService', function($scope, $location, $timeout, Session, UserFactory, alertService) {
    $scope.isUploading = false;
    $scope.progress = 0;


    $scope.user = {
      _id: '',
      name: '',
      email: '',
      location: '',
      photo: '',
      about_me: '',
      about_me_html: '',
      about_me_stripped: '',
      school: '',
      website: '',
      github: '',
      linkedin: '',
      codecademy: '',
      campaign_status: 'not created'
    };

    $scope.credentials = {
      new_password: '',
      confirm_password: ''
    }

    if(Session.isSignedIn()){
      UserFactory.get(Session.getUser())
        .then(function(res){
          $scope.user = res;
        }, function(err){
          console.log(err);
        });
    } else {
      // show alert on signin page (you must sign in to see account page)
      $location.path('/signin');
    }

    $scope.updateProfile = function(user) {
      // User.put
      var converter = new Showdown.converter();
      user.about_me_html = converter.makeHtml(user.about_me);
      UserFactory.update(Session.currentUser._id, user)
        .then(function(res){
          alertService.add('success', 'Account settings successfully updated!');
        }, function(err){
          console.log(err);
        });
    };

    $scope.updatePassword = function(credentials) {
      if(credentials.new_password === credentials.confirm_password){
          var res = {
            user: {
              password: $scope.credentials.new_password
            }
          };
          UserFactory.updatePassword(Session.currentUser._id, res)
            .then(function(res){
              alertService.add('success', 'Password successfully updated!');
            }, function(err){
              console.log(err);
            });
        } else {
          alertService.add('error', 'Passwords do not match.');
        }
    };

    $scope.onFileSelect = function($files) {
      $scope.isUploading = true;

      for(var i = 0; i < $files.length; i++)  {
        var $file = $files[i];
        AWS.config.update({
          accessKeyId: 'AKIAICJHISDBKJ33ISGA',
          secretAccessKey: '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'});
        AWS.config.region = 'us-east-1';
        var s3 = new AWS.S3();
        var key = 'images/'+ Session.currentUser._id + '/profile.png'
        var params = {
          Bucket: 'media.codefund.io',
          Key: key,
          Body: $file
        };

        var req = s3.putObject(params, function(err, data){
          if(err){
            console.log(err);
          } else {
            $timeout(function(){
              $scope.user.photo = "//s3.amazonaws.com/media.codefund.io/" + key;
            }, 200, true);
            return false;
          }
        });

        req.on('httpUploadProgress', function(e){
          var progress = parseInt(100.0 * e.loaded / e.total);
          $scope.$apply(function() {
            $scope.progress = progress;
          });
        });
      }
    };

  }]);

angular.module('cfApp.controllers')
  .controller('ApplicationController', ['$scope', '$location', '$timeout', 'Session', 'alertService', function($scope, $location, $timeout, Session, alertService) {
    $scope.user_photo = null;

    var path = $location.path();
    if(path === '/home'){
      $('.navbar-default').css({'box-shadow': 'none'});
    }

    if(Session.isSignedIn() === true){
      $scope.user_photo = Session.currentUser.photo
    }

    $scope.isSignedIn = function() {

      return Session.isSignedIn();
    };

    $scope.signOut = function() {
      Session.removeUser();
      if(!Session.isSignedIn()){
        alertService.add('success', 'Goodbye!')
        $timeout(
          $location.path('/'),
          1000
        );
      }
    };

    $scope.$watch(Session.isSignedIn, function(newVal, oldVal){
      $scope.isSignedIn()
    });

    $scope.status = {
      isopen: false
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };




  }]);

angular.module('cfApp.controllers')
  .controller('CampaignController', ['$scope', '$routeParams', '$sce','CampaignFactory', function($scope, $routeParams, $sce, CampaignFactory){
    $scope.campaign = {
      user: {
        name: '',
        about_me: '',
        photo: '',
        codecademy: ''
      },
      backers: [],
      school: {},
      amount_funded: '',
      goal: 0,
      end_date: '',
      start_date: '',
      url: ''
    };

    var getDaysRemaining = function() {
      var end_date = $scope.campaign.end_date;
      return moment(end_date).diff(moment(), 'days');
    };

    $scope.loadCampaign = function(){
      CampaignFactory.get($routeParams.username)
      .then(function(response){
        $scope.campaign = response;
        $scope.campaign.video = $sce.trustAsResourceUrl($scope.campaign.video);
        $scope.campaign.days_remaining = getDaysRemaining();
        $scope.campaign.url = window.location.origin + window.location.pathname;
      }, function(err){
        console.log(err);

      });
    };

    $scope.loadCampaign();

  }]);

angular.module('cfApp.controllers')
  .controller('DiscoverController', ['$scope', '$location', 'CampaignFactory', function($scope, $location, CampaignFactory){

      $scope.campaigns = [
      ];

      var getDaysRemaining = function(end_date) {
        return moment(end_date).diff(moment(), 'days');
      }

      CampaignFactory.list()
        .then(function(data){
           $scope.campaigns = data;
           for(var i = 0; i < $scope.campaigns.length; i++){
              end_date = $scope.campaigns[i].end_date;
              $scope.campaigns[i].days_remaining = getDaysRemaining(end_date);
           }
        }, function(err){
          console.log(err);
        });

      $scope.goToCampaign = function(campaign){
          var url = 'campaign/' + campaign.username;
          $location.path(url);
      };
  }]);

angular.module('cfApp.controllers')
  .controller('LaunchController', ['$scope', '$location', '$timeout', 'CampaignFactory', 'SchoolFactory',
  function($scope, $location, $timeout, CampaignFactory, SchoolFactory){
    $scope.isUploading = false;
    $scope.progress = 0;

    $scope.campaign = {
      goal: 10000,
      video: '',
      school_start_date: '09/12/2014',
      school: {
        location: 'San Francisco, CA',
        name: 'Dev Bootcamp',
      }
    };

    var getSchoolId = function(data, cb){
      SchoolFactory.findOrCreate(data)
        .then(function(schoolId){
          cb(schoolId);
        }, function(err){
          console.log(err);
        });
    };

    $scope.launchCampaign = function() {
      var school = $scope.campaign.school;
      var campaign = $scope.campaign;
      getSchoolId(school, function(schoolId){
        campaign.school = schoolId;
        CampaignFactory.create(campaign)
          .then(function(response) {
            $location.path("/campaign/"+ response.username);
          },
          function(err){
            console.log(err);
          });
      });
    };

    $scope.onFileSelect = function($files) {
      $scope.isUploading = true;

      for(var i = 0; i < $files.length; i++)  {
        var $file = $files[i];
        AWS.config.update({accessKeyId: 'AKIAICJHISDBKJ33ISGA',
          secretAccessKey: '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'});
        AWS.config.region = 'us-east-1';
        var s3 = new AWS.S3();
        var key = 'videos/'+ Session.currentUser._id;
        var params = {
          Bucket: 'media.codefund.io',
          Key: key,
          Body: $file
        };

        var req = s3.putObject(params, function(err, data){
          if(err){
            console.log(err);
          } else {
            $timeout(function(){
              $scope.campaign.video = "http://s3.amazonaws.com/media.codefund.io/" + key;
            }, 200, true);
            return false;
          }
        });

        req.on('httpUploadProgress', function(e){
          var progress = parseInt(100.0 * e.loaded / e.total);
          $scope.$apply(function() {
            $scope.progress = progress;
          });
        });
      }
    };
  }]);

angular.module('cfApp.controllers')
  .controller('PledgeController', ['$scope', '$routeParams', '$location', 'CampaignFactory', 'alertService',  function($scope, $routeParams, $location, CampaignFactory, alertService){
    // amount text field
    // minimum amount
    // name and email (email required)
    Stripe.setPublishableKey('pk_live_4KG41zVoPQ2QpFfnoGsz1v2B');


    $scope.pledgeInfo = {
      name: '',
      email: '',
      cardDetails:  {
        number: '',
        cvc: '',
        expiry: ''
      }
    };

    var stripeResponseHandler = function(status, response) {
      if(response.error){
        //show alert failed transaction
      } else {
        alertService.add('success', 'Payment Successful!')
        var token = response.id;
        var data = {
          name: $scope.pledgeInfo.name,
          email: $scope.pledgeInfo.email,
          token: token,
          pledge_amount: $scope.pledgeInfo.pledge_amount
        };
        CampaignFactory.addBacker($routeParams.username, data)
          .then(function(response){
            $location.path('/campaign/'+$routeParams.username);
          }, function(err){
            console.log(err);
          });
      }
    };

    $scope.chargeCard = function(){
      alertService.add('warning', 'Processing payment...')
      var cardDetails = $scope.pledgeInfo.cardDetails;
      Stripe.card.createToken({
        number: cardDetails.number,
        cvc: cardDetails.cvc,
        exp_month: parseInt(cardDetails.expiry.split('/')[0]),
        exp_year: parseInt(cardDetails.expiry.split('/')[1])
      }, stripeResponseHandler);
    };

    $('.signup-form').card({
      container: '.card-wrapper',
      numberInput: 'input#card_number',
      expiryInput: 'input#expiry',
      cvcInput: 'input#cvc',
      nameInput: 'input#card_name',
      width: 250
    });
  }]);

angular.module('cfApp.controllers')
  .controller('SigninController', ['$scope', '$location', '$rootScope', '$timeout', 'AuthService', 'Session', 'alertService',
    function($scope, $location, $rootScope, $timeout, AuthService, Session, alertService) {
    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.signIn = function(credentials) {
        console.log('disabling..');
        $('.signin-form').attr('disabled',true);

        alertService.add('success', 'Signing in...Please wait.');
        AuthService.userSignIn(credentials)
          .then(function(response){
            if(!typeof response.error === 'undefined'){
              alertService.add('danger', response.error)
              return;
            }
            data = {
              name : response.name,
              email: response.email,
              _id: response._id.$oid,
              photo: response.photo,
              campaignStatus: response.campaign_status
            };
            Session.setUser(data);
            alertService.add('success', 'Sign In successful!');
            $location.path('/account');
          }, function(err){
            console.log(err);
            // need to point out what failed
            // password or email
          });
    };
  }]);

'use strict';

angular.module('cfApp.controllers')
  .controller('SignupController', ['$scope', '$location', '$timeout', 'AuthService', 'Session', 'alertService',
  function($scope, $location, $timeout, AuthService, Session, alertService) {

    $scope.signUp = function(credentials) {

      console.log('disabling..');
      $('.signup-form').attr('disabled',true);

      if (credentials.email === credentials.email_confirm) {

        AuthService.userSignUp(credentials)
          .then(function(res){
            if(res.name){
              var data = {
                name : res.name,
                email: res.email,
                photo: res.photo,
                campaignStatus: res.campaign_status,
                _id: res._id.$oid
              };
              Session.setUser(data);
              setTimeout(function(){
              }, 5000);
              alertService.add('success', 'Account successfully created!');
              $location.path('/account');
            }

          }, function(err){
            console.log(err);
          });

      } else {
        alertService.add('danger', 'Emails do not match.');
      }
    };

  }]);

angular.module('cfApp.directives')
  .directive('markdown', function () {
      var converter = new Showdown.converter();
      return {
        restrict: 'A',
        scope: {
          text: '@'
        },
        link: function (scope, element, attrs) {
          attrs.$observe('text', function(value){
            var htmlText = converter.makeHtml(value);
            element.html(htmlText);
          });
        }
      }
  });

angular.module('cfApp.factories')
  .factory('CampaignFactory', ['$http', '$q', 'Session', function($http, $q, Session){
      return {
        list: function(){
          var deferred = $q.defer();
          $http.get('/api/campaigns.json')
            .success(function(response){
              return deferred.resolve(response);
            })
            .error(function(err){
              return deferred.reject(err);
            })
          return deferred.promise;
        },
        create: function(data){
          var deferred = $q.defer();
          data.user = Session.currentUser._id
          $http.post('/api/campaigns.json', data)
            .success(function(response){
              return deferred.resolve(response);
            })
            .error(function(err){
              return deferred.reject(err);
            });
          return deferred.promise;
        },
        get: function(username){
          var deferred = $q.defer();
          $http.get('/api/campaigns/'+ username +'.json')
            .success(function(response){
              return deferred.resolve(response);
            })
            .error(function(err){
              return deferred.reject(err);
            });
          return deferred.promise;
        },
        addBacker: function(username, data){
          campaign_data = { campaign: data };
          var deferred = $q.defer();
          $http.put('/api/campaigns/'+ username +'.json', campaign_data)
            .success(function(response){
              return deferred.resolve(response);
            })
            .error(function(err){
              return deferred.reject(err);
            });
          return deferred.promise;
        }
      };
  }]);

angular.module('cfApp.factories')
  .factory('SchoolFactory', ['$http', '$q', function ($http, $q) {
    return {
      findOrCreate: function (data) {
        var deferred = $q.defer();
        $http.post('/api/schools.json', data)
          .success(function(response){
            console.log(response);
            deferred.resolve(response[0]._id.$oid);
          })
          .error(function(err){
            deferred.reject(err);
          });
        return deferred.promise;
      }
    };
  }]);

angular.module('cfApp.factories')
  .factory('UserFactory', ['$http','$q', function($http, $q) {
    return {
      get: function(options){
        var deferred = $q.defer();
        $http.get('/api/users/'+options._id+'.json')
          .success(function(response){
            deferred.resolve(response);
          })
          .error(function(err){
            deferred.reject(err);
          });
        return deferred.promise;
      },
      update: function(_id, options){
        var deferred = $q.defer();
        $http.put('/api/users/'+_id+'.json', options)
          .success(function(response){
            deferred.resolve(response);
          })
          .error(function(err){
            deferred.reject(err);
          });
        return deferred.promise;
      },
      updatePassword: function(_id, options){
        var deferred = $q.defer();
        $http.put('/api/users/pw/'+_id+'.json', options)
          .success(function(response){
            deferred.resolve(response);
          })
          .error(function(err){
            deferred.reject(err);
          });
        return deferred.promise;
      }
    };
  }]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var $, cardFromNumber, cardFromType, cards, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardNumber, formatExpiry, formatForwardExpiry, formatForwardSlash, hasTextSelected, luhnCheck, reFormatCardNumber, restrictCVC, restrictCardNumber, restrictExpiry, restrictNumeric, setCardType,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  $.payment = {};

  $.payment.fn = {};

  $.fn.payment = function() {
    var args, method;
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return $.payment.fn[method].apply(this, args);
  };

  defaultFormat = /(\d{1,4})/g;

  cards = [
    {
      type: 'maestro',
      pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
      format: defaultFormat,
      length: [12, 13, 14, 15, 16, 17, 18, 19],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'dinersclub',
      pattern: /^(36|38|30[0-5])/,
      format: defaultFormat,
      length: [14],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'laser',
      pattern: /^(6706|6771|6709)/,
      format: defaultFormat,
      length: [16, 17, 18, 19],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'jcb',
      pattern: /^35/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'unionpay',
      pattern: /^62/,
      format: defaultFormat,
      length: [16, 17, 18, 19],
      cvcLength: [3],
      luhn: false
    }, {
      type: 'discover',
      pattern: /^(6011|65|64[4-9]|622)/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'mastercard',
      pattern: /^5[1-5]/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'amex',
      pattern: /^3[47]/,
      format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
      length: [15],
      cvcLength: [3, 4],
      luhn: true
    }, {
      type: 'visa',
      pattern: /^4/,
      format: defaultFormat,
      length: [13, 16],
      cvcLength: [3],
      luhn: true
    }
  ];

  cardFromNumber = function(num) {
    var card, _i, _len;
    num = (num + '').replace(/\D/g, '');
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
      card = cards[_i];
      if (card.pattern.test(num)) {
        return card;
      }
    }
  };

  cardFromType = function(type) {
    var card, _i, _len;
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
      card = cards[_i];
      if (card.type === type) {
        return card;
      }
    }
  };

  luhnCheck = function(num) {
    var digit, digits, odd, sum, _i, _len;
    odd = true;
    sum = 0;
    digits = (num + '').split('').reverse();
    for (_i = 0, _len = digits.length; _i < _len; _i++) {
      digit = digits[_i];
      digit = parseInt(digit, 10);
      if ((odd = !odd)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  hasTextSelected = function($target) {
    var _ref;
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
      return true;
    }
    if (typeof document !== "undefined" && document !== null ? (_ref = document.selection) != null ? typeof _ref.createRange === "function" ? _ref.createRange().text : void 0 : void 0 : void 0) {
      return true;
    }
    return false;
  };

  reFormatCardNumber = function(e) {
    return setTimeout((function(_this) {
      return function() {
        var $target, value;
        $target = $(e.currentTarget);
        value = $target.val();
        value = $.payment.formatCardNumber(value);
        return $target.val(value);
      };
    })(this));
  };

  formatCardNumber = function(e) {
    var $target, card, digit, length, re, upperLength, value;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    value = $target.val();
    card = cardFromNumber(value + digit);
    length = (value.replace(/\D/g, '') + digit).length;
    upperLength = 16;
    if (card) {
      upperLength = card.length[card.length.length - 1];
    }
    if (length >= upperLength) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (card && card.type === 'amex') {
      re = /^(\d{4}|\d{4}\s\d{6})$/;
    } else {
      re = /(?:^|\s)(\d{4})$/;
    }
    if (re.test(value)) {
      e.preventDefault();
      return $target.val(value + ' ' + digit);
    } else if (re.test(value + digit)) {
      e.preventDefault();
      return $target.val(value + digit + ' ');
    }
  };

  formatBackCardNumber = function(e) {
    var $target, value;
    $target = $(e.currentTarget);
    value = $target.val();
    if (e.meta) {
      return;
    }
    if (e.which !== 8) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (/\d\s$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\d\s$/, ''));
    } else if (/\s\d?$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\s\d?$/, ''));
    }
  };

  formatExpiry = function(e) {
    var $target, digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val() + digit;
    if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
      e.preventDefault();
      return $target.val("0" + val + " / ");
    } else if (/^\d\d$/.test(val)) {
      e.preventDefault();
      return $target.val("" + val + " / ");
    }
  };

  formatForwardExpiry = function(e) {
    var $target, digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val();
    if (/^\d\d$/.test(val)) {
      return $target.val("" + val + " / ");
    }
  };

  formatForwardSlash = function(e) {
    var $target, slash, val;
    slash = String.fromCharCode(e.which);
    if (slash !== '/') {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val();
    if (/^\d$/.test(val) && val !== '0') {
      return $target.val("0" + val + " / ");
    }
  };

  formatBackExpiry = function(e) {
    var $target, value;
    if (e.meta) {
      return;
    }
    $target = $(e.currentTarget);
    value = $target.val();
    if (e.which !== 8) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (/\d(\s|\/)+$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\d(\s|\/)*$/, ''));
    } else if (/\s\/\s?\d?$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\s\/\s?\d?$/, ''));
    }
  };

  restrictNumeric = function(e) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  };

  restrictCardNumber = function(e) {
    var $target, card, digit, value;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    value = ($target.val() + digit).replace(/\D/g, '');
    card = cardFromNumber(value);
    if (card) {
      return value.length <= card.length[card.length.length - 1];
    } else {
      return value.length <= 16;
    }
  };

  restrictExpiry = function(e) {
    var $target, digit, value;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    value = $target.val() + digit;
    value = value.replace(/\D/g, '');
    if (value.length > 6) {
      return false;
    }
  };

  restrictCVC = function(e) {
    var $target, digit, val;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    val = $target.val() + digit;
    return val.length <= 4;
  };

  setCardType = function(e) {
    var $target, allTypes, card, cardType, val;
    $target = $(e.currentTarget);
    val = $target.val();
    cardType = $.payment.cardType(val) || 'unknown';
    if (!$target.hasClass(cardType)) {
      allTypes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = cards.length; _i < _len; _i++) {
          card = cards[_i];
          _results.push(card.type);
        }
        return _results;
      })();
      $target.removeClass('unknown');
      $target.removeClass(allTypes.join(' '));
      $target.addClass(cardType);
      $target.toggleClass('identified', cardType !== 'unknown');
      return $target.trigger('payment.cardType', cardType);
    }
  };

  $.payment.fn.formatCardCVC = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictCVC);
    return this;
  };

  $.payment.fn.formatCardExpiry = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictExpiry);
    this.on('keypress', formatExpiry);
    this.on('keypress', formatForwardSlash);
    this.on('keypress', formatForwardExpiry);
    this.on('keydown', formatBackExpiry);
    return this;
  };

  $.payment.fn.formatCardNumber = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictCardNumber);
    this.on('keypress', formatCardNumber);
    this.on('keydown', formatBackCardNumber);
    this.on('keyup', setCardType);
    this.on('paste', reFormatCardNumber);
    return this;
  };

  $.payment.fn.restrictNumeric = function() {
    this.on('keypress', restrictNumeric);
    return this;
  };

  $.payment.fn.cardExpiryVal = function() {
    return $.payment.cardExpiryVal($(this).val());
  };

  $.payment.cardExpiryVal = function(value) {
    var month, prefix, year, _ref;
    value = value.replace(/\s/g, '');
    _ref = value.split('/', 2), month = _ref[0], year = _ref[1];
    if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
      prefix = (new Date).getFullYear();
      prefix = prefix.toString().slice(0, 2);
      year = prefix + year;
    }
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    return {
      month: month,
      year: year
    };
  };

  $.payment.validateCardNumber = function(num) {
    var card, _ref;
    num = (num + '').replace(/\s+|-/g, '');
    if (!/^\d+$/.test(num)) {
      return false;
    }
    card = cardFromNumber(num);
    if (!card) {
      return false;
    }
    return (_ref = num.length, __indexOf.call(card.length, _ref) >= 0) && (card.luhn === false || luhnCheck(num));
  };

  $.payment.validateCardExpiry = (function(_this) {
    return function(month, year) {
      var currentTime, expiry, prefix, _ref;
      if (typeof month === 'object' && 'month' in month) {
        _ref = month, month = _ref.month, year = _ref.year;
      }
      if (!(month && year)) {
        return false;
      }
      month = $.trim(month);
      year = $.trim(year);
      if (!/^\d+$/.test(month)) {
        return false;
      }
      if (!/^\d+$/.test(year)) {
        return false;
      }
      if (!(parseInt(month, 10) <= 12)) {
        return false;
      }
      if (year.length === 2) {
        prefix = (new Date).getFullYear();
        prefix = prefix.toString().slice(0, 2);
        year = prefix + year;
      }
      expiry = new Date(year, month);
      currentTime = new Date;
      expiry.setMonth(expiry.getMonth() - 1);
      expiry.setMonth(expiry.getMonth() + 1, 1);
      return expiry > currentTime;
    };
  })(this);

  $.payment.validateCardCVC = function(cvc, type) {
    var _ref, _ref1;
    cvc = $.trim(cvc);
    if (!/^\d+$/.test(cvc)) {
      return false;
    }
    if (type) {
      return _ref = cvc.length, __indexOf.call((_ref1 = cardFromType(type)) != null ? _ref1.cvcLength : void 0, _ref) >= 0;
    } else {
      return cvc.length >= 3 && cvc.length <= 4;
    }
  };

  $.payment.cardType = function(num) {
    var _ref;
    if (!num) {
      return null;
    }
    return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null;
  };

  $.payment.formatCardNumber = function(num) {
    var card, groups, upperLength, _ref;
    card = cardFromNumber(num);
    if (!card) {
      return num;
    }
    upperLength = card.length[card.length.length - 1];
    num = num.replace(/\D/g, '');
    num = num.slice(0, +upperLength + 1 || 9e9);
    if (card.format.global) {
      return (_ref = num.match(card.format)) != null ? _ref.join(' ') : void 0;
    } else {
      groups = card.format.exec(num);
      if (groups != null) {
        groups.shift();
      }
      return groups != null ? groups.join(' ') : void 0;
    }
  };

}).call(this);

},{}],2:[function(require,module,exports){
var $, Card,
  __slice = [].slice;

require('jquery.payment');

$ = jQuery;

$.card = {};

$.card.fn = {};

$.fn.card = function(opts) {
  return $.card.fn.construct.apply(this, opts);
};

Card = (function() {
  Card.prototype.cardTemplate = "<div class=\"card-container\">\n    <div class=\"card\">\n        <div class=\"front\">\n                <div class=\"card-logo visa\">visa</div>\n                <div class=\"card-logo mastercard\">MasterCard</div>\n                <div class=\"card-logo amex\"></div>\n                <div class=\"card-logo discover\">discover</div>\n            <div class=\"lower\">\n                <div class=\"shiny\"></div>\n                <div class=\"cvc display\">{{cvc}}</div>\n                <div class=\"number display\">{{number}}</div>\n                <div class=\"name display\">{{name}}</div>\n                <div class=\"expiry display\" data-before=\"{{monthYear}}\" data-after=\"{{validDate}}\">{{expiry}}</div>\n            </div>\n        </div>\n        <div class=\"back\">\n            <div class=\"bar\"></div>\n            <div class=\"cvc display\">{{cvc}}</div>\n            <div class=\"shiny\"></div>\n        </div>\n    </div>\n</div>";

  Card.prototype.template = function(tpl, data) {
    return tpl.replace(/\{\{(.*?)\}\}/g, function(match, key, str) {
      return data[key];
    });
  };

  Card.prototype.cardTypes = ['maestro', 'dinersclub', 'laser', 'jcb', 'unionpay', 'discover', 'mastercard', 'amex', 'visa'];

  Card.prototype.defaults = {
    formatting: true,
    formSelectors: {
      numberInput: 'input[name="number"]',
      expiryInput: 'input[name="expiry"]',
      cvcInput: 'input[name="cvc"]',
      nameInput: 'input[name="name"]'
    },
    cardSelectors: {
      cardContainer: '.card-container',
      card: '.card',
      numberDisplay: '.number',
      expiryDisplay: '.expiry',
      cvcDisplay: '.cvc',
      nameDisplay: '.name'
    },
    messages: {
      validDate: 'valid\nthru',
      monthYear: 'month/year'
    },
    values: {
      number: '&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;',
      cvc: '&bull;&bull;&bull;',
      expiry: '&bull;&bull;/&bull;&bull;',
      name: 'Full Name'
    },
    classes: {
      valid: 'card-valid',
      invalid: 'card-invalid'
    }
  };

  function Card(el, opts) {
    this.options = $.extend(true, {}, this.defaults, opts);
    $.extend(this.options.messages, $.card.messages);
    $.extend(this.options.values, $.card.values);
    this.$el = $(el);
    if (!this.options.container) {
      console.log("Please provide a container");
      return;
    }
    this.$container = $(this.options.container);
    this.render();
    this.attachHandlers();
    this.handleInitialValues();
  }

  Card.prototype.render = function() {
    var baseWidth, ua;
    this.$container.append(this.template(this.cardTemplate, $.extend({}, this.options.messages, this.options.values)));
    $.each(this.options.cardSelectors, (function(_this) {
      return function(name, selector) {
        return _this["$" + name] = _this.$container.find(selector);
      };
    })(this));
    $.each(this.options.formSelectors, (function(_this) {
      return function(name, selector) {
        var obj;
        if (_this.options[name]) {
          obj = $(_this.options[name]);
        } else {
          obj = _this.$el.find(selector);
        }
        if (!obj.length) {
          console.error("Card can't find a " + name + " in your form.");
        }
        return _this["$" + name] = obj;
      };
    })(this));
    if (this.options.formatting) {
      this.$numberInput.payment('formatCardNumber');
      this.$cvcInput.payment('formatCardCVC');
      if (this.$expiryInput.length === 1) {
        this.$expiryInput.payment('formatCardExpiry');
      }
    }
    if (this.options.width) {
      baseWidth = parseInt(this.$cardContainer.css('width'));
      this.$cardContainer.css("transform", "scale(" + (this.options.width / baseWidth) + ")");
    }
    if (typeof navigator !== "undefined" && navigator !== null ? navigator.userAgent : void 0) {
      ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
        this.$card.addClass('safari');
      }
    }
    if (new Function("/*@cc_on return @_jscript_version; @*/")()) {
      return this.$card.addClass('ie-10');
    }
  };

  Card.prototype.attachHandlers = function() {
    var expiryFilters;
    this.$numberInput.bindVal(this.$numberDisplay, {
      fill: false,
      filters: this.validToggler('cardNumber')
    }).on('payment.cardType', this.handle('setCardType'));
    expiryFilters = [
      function(val) {
        return val.replace(/(\s+)/g, '');
      }
    ];
    if (this.$expiryInput.length === 1) {
      expiryFilters.push(this.validToggler('cardExpiry'));
      this.$expiryInput.on('keydown', this.handle('captureTab'));
    }
    this.$expiryInput.bindVal(this.$expiryDisplay, {
      join: function(text) {
        if (text[0].length === 2 || text[1]) {
          return "/";
        } else {
          return "";
        }
      },
      filters: expiryFilters
    });
    this.$cvcInput.bindVal(this.$cvcDisplay, {
      filters: this.validToggler('cardCVC')
    }).on('focus', this.handle('flipCard')).on('blur', this.handle('flipCard'));
    return this.$nameInput.bindVal(this.$nameDisplay, {
      fill: false,
      filters: this.validToggler('cardHolderName'),
      join: ' '
    }).on('keydown', this.handle('captureName'));
  };

  Card.prototype.handleInitialValues = function() {
    return $.each(this.options.formSelectors, (function(_this) {
      return function(name, selector) {
        var el;
        el = _this["$" + name];
        if (el.val()) {
          el.trigger('paste');
          return setTimeout(function() {
            return el.trigger('keyup');
          });
        }
      };
    })(this));
  };

  Card.prototype.handle = function(fn) {
    return (function(_this) {
      return function(e) {
        var $el, args;
        $el = $(e.currentTarget);
        args = Array.prototype.slice.call(arguments);
        args.unshift($el);
        return _this.handlers[fn].apply(_this, args);
      };
    })(this);
  };

  Card.prototype.validToggler = function(validatorName) {
    var isValid;
    if (validatorName === "cardExpiry") {
      isValid = function(val) {
        var objVal;
        objVal = $.payment.cardExpiryVal(val);
        return $.payment.validateCardExpiry(objVal.month, objVal.year);
      };
    } else if (validatorName === "cardCVC") {
      isValid = (function(_this) {
        return function(val) {
          return $.payment.validateCardCVC(val, _this.cardType);
        };
      })(this);
    } else if (validatorName === "cardNumber") {
      isValid = function(val) {
        return $.payment.validateCardNumber(val);
      };
    } else if (validatorName === "cardHolderName") {
      isValid = function(val) {
        return val !== "";
      };
    }
    return (function(_this) {
      return function(val, $in, $out) {
        var result;
        result = isValid(val);
        _this.toggleValidClass($in, result);
        _this.toggleValidClass($out, result);
        return val;
      };
    })(this);
  };

  Card.prototype.toggleValidClass = function(el, test) {
    el.toggleClass(this.options.classes.valid, test);
    return el.toggleClass(this.options.classes.invalid, !test);
  };

  Card.prototype.handlers = {
    setCardType: function($el, e, cardType) {
      if (!this.$card.hasClass(cardType)) {
        this.$card.removeClass('unknown');
        this.$card.removeClass(this.cardTypes.join(' '));
        this.$card.addClass(cardType);
        this.$card.toggleClass('identified', cardType !== 'unknown');
        return this.cardType = cardType;
      }
    },
    flipCard: function($el, e) {
      return this.$card.toggleClass('flipped');
    },
    captureTab: function($el, e) {
      var keyCode, val;
      keyCode = e.keyCode || e.which;
      if (keyCode !== 9 || e.shiftKey) {
        return;
      }
      val = $el.payment('cardExpiryVal');
      if (!(val.month || val.year)) {
        return;
      }
      if (!$.payment.validateCardExpiry(val.month, val.year)) {
        return e.preventDefault();
      }
    },
    captureName: function($el, e) {
      var banKeyCodes;
      banKeyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 106, 107, 109, 110, 111, 186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222];
      if (banKeyCodes.indexOf(e.which || e.keyCode) !== -1) {
        return e.preventDefault();
      }
    }
  };

  $.fn.bindVal = function(out, opts) {
    var $el, i, joiner, o, outDefaults;
    if (opts == null) {
      opts = {};
    }
    opts.fill = opts.fill || false;
    opts.filters = opts.filters || [];
    if (!(opts.filters instanceof Array)) {
      opts.filters = [opts.filters];
    }
    opts.join = opts.join || "";
    if (!(typeof opts.join === "function")) {
      joiner = opts.join;
      opts.join = function() {
        return joiner;
      };
    }
    $el = $(this);
    outDefaults = (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = out.length; _i < _len; i = ++_i) {
        o = out[i];
        _results.push(out.eq(i).text());
      }
      return _results;
    })();
    $el.on('focus', function() {
      return out.addClass('focused');
    });
    $el.on('blur', function() {
      return out.removeClass('focused');
    });
    $el.on('keyup change paste', function(e) {
      var filter, join, outVal, val, _i, _j, _len, _len1, _ref, _results;
      val = $el.map(function() {
        return $(this).val();
      }).get();
      join = opts.join(val);
      val = val.join(join);
      if (val === join) {
        val = "";
      }
      _ref = opts.filters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filter = _ref[_i];
        val = filter(val, $el, out);
      }
      _results = [];
      for (i = _j = 0, _len1 = out.length; _j < _len1; i = ++_j) {
        o = out[i];
        if (opts.fill) {
          outVal = val + outDefaults[i].substring(val.length);
        } else {
          outVal = val || outDefaults[i];
        }
        _results.push(out.eq(i).text(outVal));
      }
      return _results;
    });
    return $el;
  };

  return Card;

})();

$.fn.extend({
  card: function() {
    var args, option;
    option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data('card');
      if (!data) {
        $this.data('card', (data = new Card(this, option)));
      }
      if (typeof option === 'string') {
        return data[option].apply(data, args);
      }
    });
  }
});


},{"jquery.payment":1}]},{},[2])

angular.module('cfApp.filters')
    .filter('currencyFormat', function () {
        return function (input, format) {
            if (input == null || format == null)
                return input;
            if (format === '')
                return '';

            return numeral(input).format(format);
        };
    });

angular.module('cfApp.filters')
  .filter('dateFormat', function(){
      return function(input, format) {
        if (input == null || format == null)
            return input;
        if (format == '')
            return ''
        return moment(input).format(format);
      };
  });

angular.module('cfApp.services')
  .service('alertService', ['$rootScope', '$timeout', function($rootScope, $timeout){
    var alertService = {};

    // create an array of alerts available globally
    $rootScope.alerts = [];


    alertService.add = function(type, msg) {
      $rootScope.alerts.push({
        type: type,
        msg: msg,
        close: function(){
          alertService.closeAlert();
        }
      });
      $timeout(function(){
        $rootScope.alerts.pop();
      }, 2000)
    };

    alertService.closeAlert = function(index) {
      $rootScope.alerts.splice(index, 1);
    };

    return alertService;

  }]);

angular.module('cfApp.services')
  .service('AuthService', ['$http', '$q', function($http, $q){

    this.userSignUp = function(options) {
        var deferred = $q.defer();
        $http.post('/api/users.json', options, {
            xsrfHeaderName: 'X-CSRF-Token',
            xsrfCookieName: 'unique-token'
          })
          .success(function(response) {
            deferred.resolve(response);
          })
          .error(function(err){
            deferred.reject(err);
          });
        return deferred.promise;
      };

    this.userSignIn = function(options) {
        var deferred = $q.defer();
        $http.get('/api/users.json', {params: options})
          .success(function(response) {
            // get success response and return to controller use Session and go ahead and set cookie
            deferred.resolve(response);
          })
          .error(function(err){
            deferred.reject(err);
          });
        return deferred.promise;
    };

  }]);

angular.module('cfApp.services')
  .service('Session', ['$cookieStore', function($cookieStore){
    this.currentUser = $cookieStore.get('_cf_user');

    this.signedIn = !!$cookieStore.get('_cf_user');

    this.setUser = function(options) {
        $cookieStore.put('_cf_user', options);
    };

    this.removeUser = function() {
        return $cookieStore.remove('_cf_user')
    };

    this.isSignedIn = function() {
        return !!$cookieStore.get('_cf_user');
    };

    this.getUser = function() {
       return $cookieStore.get('_cf_user');
    };

  }]);
