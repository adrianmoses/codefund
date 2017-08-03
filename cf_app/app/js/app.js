
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
