angular.module('cfApp.filters')
  .filter('dateFormat', function(){
      return function(input, format) {
        if (input == null || format == null)
            return input;
        if (format == '')
            return ''
        return moment(input).format(format);
      };
  });
