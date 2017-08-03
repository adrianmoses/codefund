angular.module('cfApp.directives')
  .directive('markdown', function () {
      var converter = new Showdown.converter();
      return {
        restrict: 'A',
        scope: {
          text: '@'
        },
        link: function (scope, element, attrs) {
          attrs.$observe('text', function(value){
            var htmlText = converter.makeHtml(value);
            element.html(htmlText);
          });
        }
      }
  });
