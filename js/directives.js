'use strict';

var direc = angular.module('directives', []);

direc.directive('scrolly', [
  '$parse', 
  function ($parse) {
    return {
        compile: function ($element, attr) {
          var fn = $parse(attr['scrolly'], null, true);
          return function scrollyHandler(scope, element) {
            element.on('scroll', function (event) {
              //console.log(fn(scope, {'$event':event}));
              fn(scope, {'$event': event});
              //callback = function () {
              //};
              //scope.$apply(callback);
            });
          };
        },
    };
  }
]);
