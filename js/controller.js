'use strict';

var ctrls = angular.module('ctrl', []);

ctrls.controller('LifeCtrl', [
  '$scope',
  function ($scope) {

    var Stage = function (data) {
      return {
        _x: -1,
        _width: -1,
        _state: false,
        title: data.title,
        desc: data.desc,
        from: data.from,
        to: data.to,
        x: function (newX) {
          if (newX !== undefined) {
            this._x = newX;
            return
          } else {
            return this._x;
          }
        },
        width: function (newW) {
          if (newW !== undefined) {
            this._width = newW;
            return
          } else {
            return this._width;
          }
        },
        isActive: function(scrollPos) {
          var s = (this.x() + this.width());
          //console.log(this.x() +" : "+ scrollPos +" : "+ s);
          if (this.x() < scrollPos && scrollPos < s) {
            return true;
          }

          return false;
        },

        onList: function (state) {
          if (state !== undefined) {
            this._state = state;
            return 
          }
          return this._state;
        }

      };

    }

    var showStages = function (stages, scrollPos) {
      angular.forEach(stages, function (val, i) {
        if (!val.onList() && val.isActive(scrollPos)) {
          console.log('append '+ val.title);
          $scope.stages.active.push(val);
          val.onList(true);
        }
      });
      $scope.$apply();
    }

    var hideStages = function (stages, scrollPos) {
      angular.forEach(stages, function (val, i) {
        if (!val.isActive(scrollPos)) {
          console.log('remove '+ val.title);
          $scope.stages.active.splice(i, 1);
          val.onList(false);
        }
      });
      $scope.$apply();
    }

    var drawStages = function (paper, stages) {
      console.log('start drawing');
      angular.forEach(stages, function (val, i) {
        console.log('draw '+ val.title);
        var r = paper.rect(100*(i+1), 10*(i+1), 50, 5);
        stages[i].x(r.attr().x);
        stages[i].width(r.attr().width);
      });
    }

    var init = function() {
      $scope.stages = {
        all: [],
        active: [],
      };

      var paper = Raphael(angular.element('#life')[0], 600, 200);

      var s1 = new Stage({
        title: 'Zweirad-Berndt',
        desc: 'Arbeiten beim Roland',
        from: new Date(),
        to: new Date(),
      });

      var s2 = new Stage({
        title: 'HFT Stuttgart - Mathematik Studium',
        desc: 'Studium der Mathematik',
        from: new Date(),
        to: new Date(),
      });

      $scope.stages.all.push(s1, s2);

      drawStages(paper, $scope.stages.all);

    }


    $scope.ctrlStages = function (e) {
      var pos = e.target.scrollLeft;
      showStages($scope.stages.all, pos);
      hideStages($scope.stages.all, pos);
    }

    init();

  }
]);
