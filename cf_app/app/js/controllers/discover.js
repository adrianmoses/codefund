angular.module('cfApp.controllers')
  .controller('DiscoverController', ['$scope', '$location', 'CampaignFactory', function($scope, $location, CampaignFactory){

      $scope.campaigns = [
      ];

      var getDaysRemaining = function(end_date) {
        return moment(end_date).diff(moment(), 'days');
      }

      CampaignFactory.list()
        .then(function(data){
           $scope.campaigns = data;
           for(var i = 0; i < $scope.campaigns.length; i++){
              end_date = $scope.campaigns[i].end_date;
              $scope.campaigns[i].days_remaining = getDaysRemaining(end_date);
           }
        }, function(err){
          console.log(err);
        });

      $scope.goToCampaign = function(campaign){
          var url = 'campaign/' + campaign.username;
          $location.path(url);
      };
  }]);
