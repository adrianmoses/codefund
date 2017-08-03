angular.module('cfApp.services')
  .service('Session', ['$cookieStore', function($cookieStore){
    this.currentUser = $cookieStore.get('_cf_user');

    this.signedIn = !!$cookieStore.get('_cf_user');

    this.setUser = function(options) {
        $cookieStore.put('_cf_user', options);
    };

    this.removeUser = function() {
        return $cookieStore.remove('_cf_user')
    };

    this.isSignedIn = function() {
        return !!$cookieStore.get('_cf_user');
    };

    this.getUser = function() {
       return $cookieStore.get('_cf_user');
    };

  }]);
