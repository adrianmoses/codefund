angular.module('cfApp.controllers')
  .controller('CampaignController', ['$scope', '$routeParams', '$sce','CampaignFactory', function($scope, $routeParams, $sce, CampaignFactory){
    $scope.campaign = {
      user: {
        name: '',
        about_me: '',
        photo: '',
        codecademy: ''
      },
      backers: [],
      school: {},
      amount_funded: '',
      goal: 0,
      end_date: '',
      start_date: '',
      url: ''
    };

    var getDaysRemaining = function() {
      var end_date = $scope.campaign.end_date;
      return moment(end_date).diff(moment(), 'days');
    };

    $scope.loadCampaign = function(){
      CampaignFactory.get($routeParams.username)
      .then(function(response){
        $scope.campaign = response;
        $scope.campaign.video = $sce.trustAsResourceUrl($scope.campaign.video);
        $scope.campaign.days_remaining = getDaysRemaining();
        $scope.campaign.url = window.location.origin + window.location.pathname;
      }, function(err){
        console.log(err);

      });
    };

    $scope.loadCampaign();

  }]);
