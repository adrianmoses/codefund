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
