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
