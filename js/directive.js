'use strict';

var direct = angular.module('direct', []);

direct.directive('shorty', [
  function () {

    var trim = function (val) {
      var lines = val.split('\n');
      console.log(lines.slice(0, 3));
      return lines.splice(0, 4).join('\n');
    };

    return {
      link: function (scope, element, attr, ctrl) {

        scope.$watch(attr.shorty,
          function (val) {
            element.html(marked(trim(val)));
          }
        );

      },
    };

  }
]);
