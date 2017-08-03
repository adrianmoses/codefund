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
