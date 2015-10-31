var app = angular.module('life', [
  'ngRoute',
  'ngSanitize',
  'ui.bootstrap',
  'srv',
  'direct',
  'ctrl'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/life', {
        templateUrl: 'public/angular-tpls/life.html',
        controller: 'LifeCtrl',
      })
      .when('/about', {
        templateUrl: 'public/angular-tpls/about.html',
        controller: 'AboutCtrl',
      })
      .when('/aboutLife', {
        templateUrl: 'public/angular-tpls/aboutLife.html',
        controller: 'AboutLifeCtrl',
      })
      .otherwise('/life');
  }
]);
