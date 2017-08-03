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
