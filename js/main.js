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
      .when('/aboutMe', {
        templateUrl: 'public/angular-tpls/aboutMe.html',
        controller: 'AboutCtrl',
      })
      .otherwise('/aboutMe');
  }
]);
