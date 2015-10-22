'use strict';

var ctrl = angular.module('ctrl', []);

ctrl.controller('LifeCtrl', [
  '$scope',
  function ($scope) {

    var init = function() {
      var paper = Raphael($('#life')[0], 600, 200);
    }

    $scope.ctrlStages = function () {
    }



    init();

  }
]);
