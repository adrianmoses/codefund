angular.module('cfApp.controllers')
  .controller('LaunchController', ['$scope', '$location', '$timeout', 'CampaignFactory', 'SchoolFactory',
  function($scope, $location, $timeout, CampaignFactory, SchoolFactory){
    $scope.isUploading = false;
    $scope.progress = 0;

    $scope.campaign = {
      goal: 10000,
      video: '',
      school_start_date: '09/12/2014',
      school: {
        location: 'San Francisco, CA',
        name: 'Dev Bootcamp',
      }
    };

    var getSchoolId = function(data, cb){
      SchoolFactory.findOrCreate(data)
        .then(function(schoolId){
          cb(schoolId);
        }, function(err){
          console.log(err);
        });
    };

    $scope.launchCampaign = function() {
      var school = $scope.campaign.school;
      var campaign = $scope.campaign;
      getSchoolId(school, function(schoolId){
        campaign.school = schoolId;
        CampaignFactory.create(campaign)
          .then(function(response) {
            $location.path("/campaign/"+ response.username);
          },
          function(err){
            console.log(err);
          });
      });
    };

    $scope.onFileSelect = function($files) {
      $scope.isUploading = true;

      for(var i = 0; i < $files.length; i++)  {
        var $file = $files[i];
        AWS.config.update({accessKeyId: 'AKIAICJHISDBKJ33ISGA',
          secretAccessKey: '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'});
        AWS.config.region = 'us-east-1';
        var s3 = new AWS.S3();
        var key = 'videos/'+ Session.currentUser._id;
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
              $scope.campaign.video = "http://s3.amazonaws.com/media.codefund.io/" + key;
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
