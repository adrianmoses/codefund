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
