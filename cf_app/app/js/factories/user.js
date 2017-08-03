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
