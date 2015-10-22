var app = angular.module('life', ['ngRoute', 'ctrl']);

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
