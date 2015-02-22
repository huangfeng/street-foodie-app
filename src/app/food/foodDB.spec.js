(function() {
  'use strict';

  describe('Food DB', function() {

    var db;
    var storage;
    var rootScope;
    var appConfig;
    var $window;
    var Q;

    beforeEach(function() {
      module('app.foodDB', 'Q');
    });

    beforeEach(inject(function(_foodDB_, _localforage_, _$rootScope_, _appConfig_, _$window_, _Q_) {
      db = _foodDB_;
      storage = _localforage_;
      rootScope = _$rootScope_;
      appConfig = _appConfig_;
      $window = _$window_;
      Q = _Q_;

      spyOn(storage, 'setItem').and.callThrough();
    }));

    beforeEach(function() {
      $window.localStorage.clear();
    });

    it('new food is based on foodDb prototype', function() {
      var n = db.new();
      expect(n.food).toBeDefined();
      expect(n.food).toBe('');
      expect(n.vendor).toBeDefined();
      expect(n.vendor).toBe('');
      expect(n.notes).toBeDefined();
      expect(n.notes).toBe('');
      expect(n.rating).toBeDefined();
      expect(n.createdAt).toBeDefined();
      expect(n.picture).toBeDefined();
      expect(n.version).toBeDefined();
    });

    it('newfood accepts optional prototype', function() {
      var def = {
        food: 'chicken wrap',
        vendor: 'wrapper',
        weather: 'rainy'
      };

      var n = db.new(def);

      expect(n.food).toBeDefined();
      expect(n.food).toBe('chicken wrap');
      expect(n.vendor).toBeDefined();
      expect(n.vendor).toBe('wrapper');
      expect(n.notes).toBeDefined();
      expect(n.rating).toBeDefined();
      expect(n.createdAt).toBeDefined();
      expect(n.weather).toBeDefined();
      expect(n.weather).toBe('rainy');
    });

    it('foodDB.new adds UUID to the new food object', function() {
      var n = db.new();
      var uuidRegExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
      expect(n.uuid).toMatch(uuidRegExp);
    });

    it('foodDB.new adds timestamep createdAt to the new food object', function() {
      var n = db.new();
      expect(n.createdAt).toMatch(/^\d{13}$/);
    });

    it('getByUUID works', function(done) {
      var n = db.new();
      var uuid = n.uuid;


      db.getDb('its514already')
      .then(function() {
        return db.save(n);
      })
      .then(function() {
        var n2 = db.getByUUID(uuid);
        expect(n).toEqual(n2);

        done();
      });

    });

    it('getAll works', function(done) {
      db.getDb('xxx')
      .then(function() {
        return db.save(db.new());
      })
      .then(function() {
        return db.save(db.new());
      })
      .then(function() {
        return db.save(db.new());
      })
      .then(function() {
        return db.save(db.new());
      })
      .then(function() {
        var all = db.getAll();
        expect(all.length).toBe(4);
        expect(all[0].uuid).toBeDefined();
        expect(all[1].uuid).toBeDefined();
        expect(all[2].uuid).toBeDefined();
        expect(all[3].uuid).toBeDefined();

        done();
      });
    });

    // foodDB.new() returned an object that was a reference to
    // the foodDB "prototype" (as in defaults), so calling it
    // returned the same object, with prevoius user input
    // present
    it('prototype is not passed as reference', function(done) {
      var f1;
      var f2;

      db.getDb()
      .then(function() {
        return db.new();
      })
      .then(function(_f1) {
        f1 = _f1;
      })
      .then(function() {
        return db.new();
      })
      .then(function(_f2) {
        f2 = _f2;
      })
      .then(function() {
        f1.food = 1;
        f2.food = 2;
        expect(f1).not.toBe(f2);
        done();
      });

    });

  });
})();
