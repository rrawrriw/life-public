'use strict';

var ctrls = angular.module('ctrl', []);

ctrls.controller('LifeCtrl', [
  '$scope',
  'Stage',
  'Stages',
  'LifePaper',
  'Schedule',
  function ($scope, Stage, Stages, LifePaper, Schedule) {

    var initRenderPage = function (dims) {
      angular.element('#life-time').attr({'min': 0, 'max': dims.main.width});
    }

    var init = function() {

      var s0 = new Stage({
        title: 'Hofmann-Verlag',
        desc: 'IT-Administrator',
        from: new Date(2007, 10, 1, 0,0,0,0),
        to: new Date(2012, 3, 1, 0,0,0,0),
      });

      var s1 = new Stage({
        title: 'Zweirad-Berndt',
        desc: 'Arbeiten beim Roland',
        from: new Date(2012, 0, 1, 0,0,0,0),
        to: new Date(2013, 1, 1, 0,0,0,0),
      });

      var s2 = new Stage({
        title: 'HFT Stuttgart - Mathematik Studium',
        desc: 'Studium der Mathematik',
        from: new Date(2012, 7, 1, 0,0,0,0),
        to: new Date(2014, 6, 1, 0,0,0,0),
      });

      var s3 = new Stage({
        title: 'HFT Stuttgart - Informatik Studium',
        desc: 'Studium der Mathematik',
        from: new Date(2014, 7, 1, 0,0,0,0),
        to: new Date(2015, 4, 1, 0,0,0,0),
      });

      $scope.stages = new Stages([s0, s1, s2, s3]);
      $scope.schedule = new Schedule($scope.stages);

      $scope.now = '04/2014';

      $scope.lifePaper = LifePaper;
      $scope.lifePaper.setup({
        paper: angular.element('#stages')[0],
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
