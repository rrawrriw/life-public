'use strict';

var ctrls = angular.module('ctrl', []);

ctrls.controller('LifeCtrl', [
  '$scope',
  '$uibModal',
  'Stage',
  'Stages',
  'LifePaper',
  'Schedule',
  'Story',
  'D',
  'Move',
  function ($scope, $uibModal, Stage, Stages, LifePaper, Schedule, Story, D, Move) {

    var initRenderPage = function (dims) {
      var pos = 1;
      $scope.lifeTime = pos;
      angular.element('#life-time').attr({'min': 0, 'max': dims.main.width});
      $scope.now = $scope.lifePaper.date(pos);
    };

    var init = function() {
      $scope.story = Story;
      $scope.move = Move;
      var success = function (story) {
        $scope.marked = marked;
        $scope.story = story;
        $scope.stages = new Stages($scope.story);
        $scope.schedule = new Schedule($scope.stages);

        $scope.now = '04/2014';

        $scope.lifePaper = LifePaper;
        $scope.lifePaper.setup({
          paper: angular.element('#stages')[0],
          colors: ['#ffec00'], //'#87888C'],
          stages: $scope.stages,
          schedule: $scope.schedule,
          mainBox: '#main',
          detailsFunc: $scope.details,
        });

        $scope.lifePaper.draw();
        initRenderPage($scope.lifePaper.dims());
      }

      var fail = function (resp) {
        $scope.globalError = {
          show: true,
          msg: resp.Err,
        };

        setTimeout(function () {
          console.log('run timeout');
          $scope.globalError = false;
          //$scope.digest();
        }, 1500);
      }

      $scope.story.read().then(success, fail);

    };

    $scope.monthString = function (month) {
      return D.monthStr(month);
    };

    $scope.details = function (id) {
      var s = $scope.stages.readStage(id);

      $uibModal.open({
        controller: 'DetailsCtrl',
        templateUrl: '/public/angular-tpls/details.html',
        resolve: {
          stage: function () {
            return s;
          }
        },
      });
    };

    $scope.ctrlStages = function (e) {
      var pos = $scope.lifeTime;
      //console.log(pos);
      $scope.activeStages = $scope.stages.activeStage(pos);
      $scope.lifePaper.timeLines.draw(pos);
      $scope.now = $scope.lifePaper.date(pos);
      $scope.move.me = false;
    };

    init();

  }
]);

ctrls.controller('AboutCtrl', [
  '$log',
  '$scope', 
  '$http',
  '$sce',
  function ($log, $scope, $http, $sce) {
    var success = function (resp) {
      console.log(resp.data['about-me']);
      $scope.content = $sce.trustAsHtml(marked(resp.data['about-me'], {"gfm": true}));
    };

    var error = function (resp) {
      $log.error(resp);
    }

    $http.get('/page/about-me').then(success, error);

  }
]);

ctrls.controller('AboutLifeCtrl', function () {
});
