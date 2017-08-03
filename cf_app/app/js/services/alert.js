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
