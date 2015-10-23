'use strict';

describe('Srv Life', function() {

  beforeEach(module('life'));

  describe('Stages', function () {

    var stages,
        s1,
        s2,
        s3;

    beforeEach(inject(function ($injector) {
      var Stage = $injector.get('Stage');
      s1 = new Stage({
        title: "Stage 1",
        desc: "Desc Stage 1",
        from: new Date(2010, 1, 1, 0,0,0,0),
        to: new Date(2010, 1, 1, 0,0,0,0),
      });
      s1.x(20);
      s1.width(40);

      s2 = new Stage({
        title: "Stage 2",
        desc: "Desc Stage 2",
        from: new Date(2010, 2, 1, 0,0,0,0),
        to: new Date(2010, 8, 1, 0,0,0,0),
      });
      s2.x(30);
      s2.width(60);

      s3 = new Stage({
        title: "Stage 3",
        desc: "Desc Stage 3",
        from: new Date(2009, 8, 1, 0,0,0,0),
        to: new Date(2010, 7, 1, 0,0,0,0),
      });
      s3.x(10);
      s3.width(110);

      stages = new $injector.get('Stages')([s1, s2, s3]);
    }));

    it('should find the newest stage', function () {
      expect(stages.newest()).toEqual(s2);
    });

    it('should find the oldest stage', function () {
      expect(stages.oldest()).toEqual(s3);
    });

    it('should return diff in month between to dates', function () {
      var d1 = new Date(2010, 4, 1, 0,0,0,0);
      var d2 = new Date(2010, 4, 1, 0,0,0,0);
      expect(stages.diffMonths(d1, d2)).toBe(0);

      var d1 = new Date(2010, 3, 1, 0,0,0,0);
      var d2 = new Date(2010, 4, 1, 0,0,0,0);
      expect(stages.diffMonths(d1, d2)).toBe(1);

      var d1 = new Date(2010, 3, 1, 0,0,0,0);
      var d2 = new Date(2011, 3, 1, 0,0,0,0);
      expect(stages.diffMonths(d1, d2)).toBe(12);
    });

    it('should return time range between oldest and newest stage', function () {
      expect(stages.timeRange()).toBe(12)
    });

    it('should return the active stages', function () {
      expect(stages.activeStage(100)).toEqual([s3]);
      expect(stages.activeStage(80)).toEqual([s3, s2]);
    });
  });

  describe('Schedule', function () {

    var schedule, 
        stages,
        s1,
        s2,
        s3;

    beforeEach(inject(function ($injector) {
      var Stage = $injector.get('Stage');
      s1 = new Stage({
        title: "Stage 1",
        desc: "Desc Stage 1",
        from: new Date(2010, 1, 1, 0,0,0,0),
        to: new Date(2010, 1, 1, 0,0,0,0),
      });
      s1.x(20);
      s1.width(40);

      s2 = new Stage({
        title: "Stage 2",
        desc: "Desc Stage 2",
        from: new Date(2010, 2, 1, 0,0,0,0),
        to: new Date(2010, 8, 1, 0,0,0,0),
      });
      s2.x(30);
      s2.width(60);

      s3 = new Stage({
        title: "Stage 3",
        desc: "Desc Stage 3",
        from: new Date(2009, 8, 1, 0,0,0,0),
        to: new Date(2010, 7, 1, 0,0,0,0),
      });
      s3.x(10);
      s3.width(110);

      stages = new $injector.get('Stages')([s1, s2, s3]);

      schedule = new $injector.get('Schedule')(stages);
    }));

    it('should append a new level to schedule', function () {
      var exp = [
        {
          "2009": [true, true, true, true, true, true, true, true, true, true, true, true],
          "2010": [true, true, true, true, true, true, true, true, true, true, true, true],
        }
      ];

      schedule.appendLevel();
      expect(schedule._schedule).toEqual(exp);
    });

    it('schould append stage', function () {
      var exp = [
        {
          "2009": [true, true, true, true, true, true, true, true, 2, 2, 2, 2],
          "2010": [2, 2, 2, 2, 2, 2, 2, 2, true, true, true, true], 
        }
      ]
      schedule.appendLevel();
      schedule.appendStage(s3, 0);
      expect(schedule._schedule).toEqual(exp);
    });

    it('should valided if it possible to put stage to level - true', function () {
      var l = {
                "2010": [1, true, true, true, true, true, true, true, true, true, true, true],
              };
      expect(schedule.validLevel(l, s2)).toBe(true);
    });

    it('should valided if it possible to put stage to level - false', function () {
      var l = {
        "2009": [true, true, true, true, true, true, true, 3, 3, 3, 3, 3],
        "2010": [3, 3, 3, 3, 3, 3, 3, true, true, true, true, true],
      };
      expect(schedule.validLevel(l, s2)).toBe(false);
    });

    it('should return schedule', function () {
      var exp = [
        {
          "2009": [true, true, true, true, true, true, true, true, 2, 2, 2, 2],
          "2010": [2, 2, 2, 2, 2, 2, 2, 2, true, true, true, true],
        },
        {
          "2009": [true, true, true, true, true, true, true, true, true, true, true, true],
          "2010": [true, 0, 1, 1, 1, 1, 1, 1, 1, true, true, true],
        }
      ];
      expect(schedule.make()).toEqual(exp);
    });


  });


});
