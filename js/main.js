var app = angular.module('life', ['ngRoute', 'ctrl', 'directives']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/life', {
        templateUrl: 'public/angular-tpls/life.html',
        controller: 'LifeCtrl',
      })
      .otherwise('/life');
  }
]);
