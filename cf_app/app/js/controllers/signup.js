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
