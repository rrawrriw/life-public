'use strict';

var ctrls = angular.module('ctrl', []);

ctrls.controller('LifeCtrl', [
  '$scope',
  'Stage',
  'Stages',
  'TimeLines',
  function ($scope, Stage, Stages, TimeLines) {


    var drawStages = function (paper, dims, stages) {
      console.log('start drawing');
      angular.forEach(stages.all(), function (val, i) {
        var diff = 4;
        var width = diff * dims.month.width;
        var r = paper.rect(100*(i+1), 30*(i+1), width, dims.stage.height);
        stages.all()[i].x(r.attr().x);
        stages.all()[i].width(r.attr().width);
      });
    };

    var drawTimeLine = function (paper, dims, from, to) {
      var p;
      var months = [];
      var diff = (to - from);
      var diffMonths = diff * 12;
      var h = dims.paper.height;
      var w = dims.paper.width;
  
      var monthHeight = 10;
      var monthWidth = Math.ceil(w / diffMonths);

      var year = from;
      var yH = (h - dims.timeLine.height); 
      for (var x=1,y=0; y <= diffMonths; x += monthWidth, y++) {
        if ((y % 12) == 0) {
          p = paper.path('M'+ x +','+ h +'L'+ x +','+ yH);
          p.translate(0.5, 0.5);
          paper.text((x + 15), dims.paper.height-5, year, dims.timeLine.fontSize);
          year++;
          continue;
        }

        var c = dims.timeLine.center;
        var s = h - (c + Math.floor(dims.month.height/2));
        var e = h - (c - Math.floor(dims.month.height/2));
        p = paper.path('M'+ x +','+ s +'L'+ x +','+ e +'');
        p.translate(0.5, 0.5);
      }

      // draw horizontal line
      p = paper.path('M1,'+ (h-dims.timeLine.center) +'L'+ (w) +','+ (h-dims.timeLine.center) +'');
      p.translate(0.5, 0.5);
    };

    var calcDims = function (stages) {

      var docWidth = angular.element(document).width();
      var docHeight = angular.element(document).height();

      var mainWidth = angular.element('#main').width();
      var mainHeight = docHeight;

      var paperWidth = mainWidth;
      var paperHeight = Math.floor(mainHeight * 0.60);

      var timeLineWidth = paperWidth;
      var timeLineHeight = Math.floor(paperWidth * 0.04);
      var timeLineCenter = Math.floor(timeLineHeight / 3);
      var timeLineFontSize = Math.floor(timeLineCenter/0.6);
      console.log(timeLineFontSize);

      var stageSpacer = Math.floor(paperHeight * 0.04);

      var sl = stages.levels();
      var stageHeight = Math.floor((paperHeight-timeLineHeight) / (sl + stageSpacer));
    
      var sm = stages.timeRange();
      var monthWidth = Math.floor(paperWidth / sm);
      var monthHeight = Math.floor(timeLineHeight / 6);

      var o = {
        doc: {
          width: docWidth,
          height: docHeight,
        },
        main: {
          width: mainWidth,
          height: mainHeight,
        },
        paper: {
          width: paperWidth,
          height: paperHeight,
        },
        timeLine: {
          width: timeLineWidth,
          height: timeLineHeight,
          center: timeLineCenter,
          fontSize: timeLineFontSize,
        },
        stageSpacer: stageSpacer,
        stage: {
          height: stageHeight,
        },
        month: {
          width: monthWidth,
          height: monthHeight,
        }
      };

      console.log(o);

      return o;
    }

    var initRenderPage = function (dims) {
      angular.element('#life-time').css({'width': dims.main.width});
      angular.element('#life-time').attr({'min': 0, 'max': dims.main.width});
    }

    var init = function() {
      var paper,
          dims;


      var s1 = new Stage({
        title: 'Zweirad-Berndt',
        desc: 'Arbeiten beim Roland',
        from: new Date('01/10/2012'),
        to: new Date('01/02/2013'),
      });

      var s2 = new Stage({
        title: 'HFT Stuttgart - Mathematik Studium',
        desc: 'Studium der Mathematik',
        from: new Date('01/08/2012'),
        to: new Date('01/07/2014'),
      });

      var s3 = new Stage({
        title: 'HFT Stuttgart - Informatik Studium',
        desc: 'Studium der Mathematik',
        from: new Date('01/08/2014'),
        to: new Date('01/05/2015'),
      });

      $scope.stages = new Stages([s1, s2, s3]);

      dims = calcDims($scope.stages);

      paper = Raphael(
        angular.element('#stages')[0],
        dims.paper.width, 
        dims.paper.height
      );

      $scope.paper = paper;
      $scope.lifeTime = 0;
      $scope.timeLines = new TimeLines(paper);
      $scope.now = '04/2014';

      initRenderPage(dims);
      drawTimeLine(paper, dims, 2012, 2016);
      drawStages(paper, dims, $scope.stages);

    }

    $scope.ctrlStages = function (e) {
      var pos = $scope.lifeTime;
      $scope.activeStages = $scope.stages.activeStage(pos);
      $scope.timeLines.draw(pos);
    }

    init();

  }
]);
