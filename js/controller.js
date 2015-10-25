'use strict';

var ctrls = angular.module('ctrl', []);

ctrls.controller('LifeCtrl', [
  '$scope',
  'Stage',
  'Stages',
  'LifePaper',
  'Schedule',
  'Story',
  function ($scope, Stage, Stages, LifePaper, Schedule, Story) {

    var initRenderPage = function (dims) {
      angular.element('#life-time').attr({'min': 0, 'max': dims.main.width});
    }

    var init = function() {
      $scope.story = Story;
      $scope.stages = new Stages($scope.story);
      $scope.schedule = new Schedule($scope.stages);

      $scope.now = '04/2014';

      $scope.lifePaper = LifePaper;
      $scope.lifePaper.setup({
        paper: angular.element('#stages')[0],
        colors: ['#ffec00', '#87888C'],
        stages: $scope.stages,
        schedule: $scope.schedule,
        mainBox: '#main',
      });

      $scope.lifePaper.draw();
      initRenderPage($scope.lifePaper.dims());

    }

    $scope.ctrlStages = function (e) {
      var pos = $scope.lifeTime;
      //console.log(pos);
      $scope.activeStages = $scope.stages.activeStage(pos);
      $scope.lifePaper.timeLines.draw(pos);
    }

    init();

  }
]);
