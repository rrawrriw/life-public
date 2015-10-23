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
              year = [true, true, true, true, true, true,
                      true, true, true, true, true, true];

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
              if (level[year][month] !== true) {
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
          var oldest = this.oldest();
          var newest = this.newest();

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
