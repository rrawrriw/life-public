'use strict';

var srv = angular.module('srv', []);

srv.factory('Stage', [
  function () {
    return function (data) {
      return {
        _id: -1,
        _x: -1,
        _width: -1,
        _state: false,
        title: data.title,
        desc: data.desc,
        from: data.from,
        to: data.to,

        id: function (newId) {
          if (newId !== undefined) {
            this._id = newId;
            return
          } else {
            return this._id;
          }
        },

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
  }
]);

srv.factory('Schedule', [
  function () {
    return function (stages) {
      return {
        _stages: stages,
        _schedule: [],

        appendLevel: function (from, to) {
          var oldest = this._stages.oldest().from.getFullYear(),
              newest = this._stages.newest().to.getFullYear(),
              level = {},
              year = [-1, -1, -1, -1, -1, -1,
                      -1, -1, -1, -1, -1, -1];

          for (var x=oldest; x <= newest; x++) {
            level[x] = year.slice();
          }

          this._schedule.push(level);
        },

        appendStage: function (stage, level) {
          var startMonth, fromYear, toYear;

          fromYear = stage.from.getFullYear();
          toYear = stage.to.getFullYear();

          startMonth = stage.to.getMonth();
          for (var year=toYear; fromYear <= year; year--) {
            for (var month=startMonth; month >= 0; month--) {
              var currDate = new Date(year, month, 1, 0,0,0,0);
              if (stage.from > currDate.getTime()) {
                return;
              }

              this._schedule[level][year][month] = stage.id();
              
            }
            startMonth = 11;
          }

          return true
        },

        validLevel: function (level, stage) {
          var startMonth, fromYear, toYear;

          fromYear = stage.from.getFullYear();
          toYear = stage.to.getFullYear();

          startMonth = stage.to.getMonth();
          for (var year=toYear; fromYear <= year; year--) {
            for (var month=startMonth; month >= 0; month--) {
              var currDate = new Date(year, month, 1, 0,0,0,0);
              // Ist der aktuell geprüfte Monat kleiner als das from Datum 
              // kann stage in diesem Level plaziert werden da zuvor kein
              // weiter stage gefunden wurde mit der es zu überschneitungen 
              // kommen würde.
              if (stage.from > currDate.getTime()) {
                return true
              }
              // Ist auf dem weg durch die Monate ein Monat nicht true 
              // heißt diese das die Level schon belegt ist.
              if (level[year][month] !== -1) {
                return false
              }
            }
            startMonth = 11;
          }

          return true
        },

        make: function () {
          var x,
            valid,
            sL = this._stages.all().slice(),
            oldest = this._stages.oldest().from.getFullYear(),
            newest = this._stages.newest().to.getFullYear();

          var cmp = function (a, b) {
            if (a.from.getTime() < b.from.getTime()) {
              return -1;
            }

            if (a.from.getTime() > b.from.getTime()) {
              return 1;
            }

          }

          this.appendLevel();

          sL.sort(cmp);

          valid = false;
          x = 0;
          for (; x < sL.length; x++) {
            var level = 0;
            for (;level < this._schedule.length; level++) {
              if (this.validLevel(this._schedule[level], sL[x])) {
                this.appendStage(sL[x], level);
                valid = true;
                break;
              }
            }
            
            if (!valid) {
              this.appendLevel();
              this.appendStage(sL[x], level);
            }

            valid = false;
          
          }

          return this._schedule;

        },

        read: function () {
          return this._schedule;
        },

        schedule: function () {
          return this._schedule;
        },

      };
    };
  }
]);

srv.factory('Stages', [
  function () {
    return function (stages) {
        angular.forEach(stages, function (val, i) {
          stages[i].id(i);
        });

        return {
        _stages: stages,
        _active: [],

        activate: function (scrollPos) {
          var that = this;
          angular.forEach(this._stages, function (val, i) {
            if (!val.onList() && val.isActive(scrollPos)) {
              that._active.push(val);
              val.onList(true);
            }
          });

          return this._active;
        },

        hide: function (scrollPos) {
          var that = this;
          angular.forEach(this._active, function (val, i) {
            if (!val.isActive(scrollPos)) {
              that._active.splice(i, 1);
              val.onList(false);
            }
          });

          return this._active;
        },

        oldest: function () {
          var oldest = stages[0];
          angular.forEach(stages, function (val, i) {
            if (oldest.from.getTime() > val.from.getTime()) {
              oldest = val;
            }
          });

          return oldest;
        },

        newest: function () {
          var newest = stages[0];
          angular.forEach(stages, function (val, i) {
            if (newest.to.getTime() < val.to.getTime()) {
              newest = val;
            }
          });

          return newest;
        },

        levels: function () {
          return 4;
        },


        diffMonths: function (d1, d2) {
          var months;
          months = (d2.getFullYear() - d1.getFullYear()) * 12;
          months -= d1.getMonth() + 1; 
          months += d2.getMonth() + 1;

          return months <= 0 ? 0 : months;
        },

        timeRange: function () {
          var oldest = this.oldest(),
              newest = this.newest();

          return this.diffMonths(oldest.from, newest.to);
        },

        activeStage: function (pos) {
          this.activate(pos);
          this.hide(pos);
          return this._active;
        },

        all: function () {
          return this._stages;
        },

        readStage: function (id) {
          var stage = undefined;
          angular.forEach(this._stages, function (val, i) {
            if (val.id() === id) {
              stage = val;
              return
            }
          });
          return stage;
        },


      };
    };
  }
]);

srv.factory('TimeLines', [
  function () {
    return function (paper) {
      return {
        _paper: paper,
        _lines: [],
        removeLines: function () {
          angular.forEach(this._lines, function (val, i) {
            val.remove();
          });
        },
        draw: function (pos) {
          this.removeLines();

          var h = this._paper.height;
          var w = this._paper.width;
          var e = this._paper.path('M'+ pos +','+ (h-5) +'L'+ pos +','+ 5 );
          e.translate(0.5, 0.5);
          this._lines.push(e);
        },
      }
    };
  }
]);

srv.factory('StateMachine', [
  function () {
    return function () {
      return {
        _noneState: -1,
        _input: [],
        _curr: -1,
        _last: -1,

        next: function (data) {
          this._last = this._input[this._input.length-1];
          if (this._last === undefined) {
            this._last = -1;
          }
          this._input.push(data);
          this._curr = data;
        },

        enterState: function () {
          if (this._last !== -1 && this._curr === -1) {
            return false;
          }

          if (this._last !== this._curr) {
            return true;
          }

          return false
        },

        leaveState: function () {
          if (this._last === -1) {
            return false;
          }

          if (this._last !== this._curr) {
            return true;
          }

          return false
        },

        inState: function () {
          if (this._last === -1) {
            return false;
          }

          if (this._last === this._curr) {
            return true
          }

          return false
        },

        noneState: function () {
          if (this._curr === this._noneState) {
            return true
          }

          return false
        },

        lastInput: function() {
          return this._last;
        }

      }
    };
  }
]);

srv.factory('LifePaper', [
  'TimeLines',
  'StateMachine',
  function (TimeLines, StateMachine) {


    return {
      _paper: {},
      _dims: {},
      _stages:  {},
      _schedule: [],

      drawStage: function (x, levelIndex, duration) {
            var levelHeight = (this._dims.levelSpacer + this._dims.stage.height),
                y = (this._dims.paper.height - (this._dims.stage.marginBottom + (levelHeight * (levelIndex + 1)))),
                width = duration * this._dims.month.width;

            var r = this._paper.rect(x, y, width, this._dims.stage.height);
            r.translate(0.5, 0.5);
            //console.log('draw stage ', x, y, width, this._dims.stage.height, r);
            return r;
              
      },

      drawStageLevel: function (level, levelIndex) {
        var that = this,
            stateMachine = new StateMachine(),
            duration = 0,
            startPos = 0,
            currPos = 0;

        angular.forEach(level, function (ids, year) {
          angular.forEach(ids, function (id, index) {
            stateMachine.next(id);

            if (stateMachine.inState()) {
              duration++;
            }

            if (stateMachine.leaveState()) {
              var rect = that.drawStage(startPos, levelIndex, duration),
                  stage = that._stages.readStage(stateMachine.lastInput());

              stage.x(rect.attrs.x);
              stage.width(rect.attrs.width);

              duration = 0;
            }

            if (stateMachine.enterState()) {
              startPos = currPos;
            }

            currPos += that._dims.month.width;

          });
        });
      },

     drawStages: function () {
        var that = this,
            schedule = this._schedule.schedule();

        angular.forEach(schedule, function (level, levelIndex) {
          that.drawStageLevel(level, (levelIndex + 1) );
        });

      },

      drawTimeLine: function () {
        var path,
            months = [],
            from = this._stages.oldest().from.getFullYear(),
            to = this._stages.newest().to.getFullYear(),
            diff = (to - from)+1,
            diffMonths = diff * 12,
            h = this._dims.paper.height,
            w = this._dims.paper.width,
            monthHeight = 10,
            monthWidth = this._dims.month.width,
            year = from,
            yH = (h - this._dims.timeLine.height); 

        for (var x=1,y=0; y <= diffMonths; x += monthWidth, y++) {
          if ((y % 12) === 0) {
            path = this._paper.path('M'+ x +','+ h +'L'+ x +','+ yH);
            path.translate(0.5, 0.5);
            if (y !== diffMonths) {
              this._paper.text((x + 15), this._dims.paper.height-5, year, this._dims.timeLine.fontSize);
            }
            year++;
            continue;
          }

          var c = this._dims.timeLine.center;
          var s = h - (c + Math.floor(this._dims.month.height/2));
          var e = h - (c - Math.floor(this._dims.month.height/2));
          path = this._paper.path('M'+ x +','+ s +'L'+ x +','+ e +'');
          path.translate(0.5, 0.5);
        }

        // draw horizontal line
        var heightTimeLineCenter = (h-this._dims.timeLine.center);
        path = this._paper.path('M1,'+ heightTimeLineCenter +'L'+ (w) +','+ heightTimeLineCenter +'');
        path.translate(0.5, 0.5);
      },

      initDims: function () {
        var docWidth = angular.element(document).width();
        var docHeight = angular.element(document).height();

        var mainWidth = angular.element(this._mainBox).width();
        var mainHeight = docHeight;

        var paperWidth = mainWidth;
        var paperHeight = Math.round(mainHeight * 0.40);

        var timeLineWidth = paperWidth;
        var timeLineHeight = Math.round(paperWidth * 0.04);
        var timeLineCenter = Math.round(timeLineHeight / 3);
        var timeLineFontSize = Math.round(timeLineCenter/0.6);

        var levelSpacer = Math.round(paperHeight * 0.08);
        var schedule = this._schedule.make();
        var sl = schedule.length;
        var stageHeight = Math.round(((paperHeight-timeLineHeight+levelSpacer) / Math.pow(sl,2)) - levelSpacer);
      
        var n = this._stages.newest();
        var o = this._stages.oldest();
        var sm = (((n.to.getFullYear() - o.from.getFullYear())+1) * 12);
        var monthWidth = Math.round(paperWidth / sm);
        var monthHeight = Math.round(timeLineHeight / 6);

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
          levelSpacer: levelSpacer,
          stage: {
            height: stageHeight,
            marginBottom: (timeLineHeight + levelSpacer),
          },
          month: {
            width: monthWidth,
            height: monthHeight,
          }
        };

        console.log(o);

        return o;
      },

      dims: function () {
        return this._dims;
      },

      setup: function (data) {
        this._stages = data.stages;
        this._mainBox = data.mainBox;
        this._schedule = data.schedule;

        this._dims = this.initDims();

        var paper = Raphael(
          data.paper,
          this._dims.paper.width, 
          this._dims.paper.height
        );

        this._paper = paper;
        this.timeLines = new TimeLines(this._paper);

      },

      draw: function () {
        this.drawTimeLine();
        this.drawStages();
      },

    };
  }
]);
