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
