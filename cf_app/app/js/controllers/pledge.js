angular.module('cfApp.controllers')
  .controller('PledgeController', ['$scope', '$routeParams', '$location', 'CampaignFactory', 'alertService',  function($scope, $routeParams, $location, CampaignFactory, alertService){
    // amount text field
    // minimum amount
    // name and email (email required)
    Stripe.setPublishableKey('pk_live_4KG41zVoPQ2QpFfnoGsz1v2B');


    $scope.pledgeInfo = {
      name: '',
      email: '',
      cardDetails:  {
        number: '',
        cvc: '',
        expiry: ''
      }
    };

    var stripeResponseHandler = function(status, response) {
      if(response.error){
        //show alert failed transaction
      } else {
        alertService.add('success', 'Payment Successful!')
        var token = response.id;
        var data = {
          name: $scope.pledgeInfo.name,
          email: $scope.pledgeInfo.email,
          token: token,
          pledge_amount: $scope.pledgeInfo.pledge_amount
        };
        CampaignFactory.addBacker($routeParams.username, data)
          .then(function(response){
            $location.path('/campaign/'+$routeParams.username);
          }, function(err){
            console.log(err);
          });
      }
    };

    $scope.chargeCard = function(){
      alertService.add('warning', 'Processing payment...')
      var cardDetails = $scope.pledgeInfo.cardDetails;
      Stripe.card.createToken({
        number: cardDetails.number,
        cvc: cardDetails.cvc,
        exp_month: parseInt(cardDetails.expiry.split('/')[0]),
        exp_year: parseInt(cardDetails.expiry.split('/')[1])
      }, stripeResponseHandler);
    };

    $('.signup-form').card({
      container: '.card-wrapper',
      numberInput: 'input#card_number',
      expiryInput: 'input#expiry',
      cvcInput: 'input#cvc',
      nameInput: 'input#card_name',
      width: 250
    });
  }]);
