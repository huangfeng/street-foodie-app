/* globals window: true */
(function() {
  'use strict';
  describe('Greyhound module', function() {

    var storage;
    var rootScope;
    var appConfig;
    var greyhound;
    var greyhoundProto;
    var Q;
    var $window;

    beforeEach(function() {
      if(window && window.localStorage) {
        window.localStorage.clear();
      }
    });

    beforeEach(function() {
      module('greyhound', 'Q', 'appConfig');
    });

    beforeEach(inject(function(_greyhound_, _localforage_, _$rootScope_, _appConfig_, _Q_, _$window_) {
      greyhoundProto = _greyhound_;
      storage = _localforage_;
      rootScope = _$rootScope_;
      appConfig = _appConfig_;
      greyhound = new _greyhound_(appConfig.storage); // jshint ignore:line
      Q = _Q_;
      $window = _$window_;
    }));

    it('is initialized', function(done) {

      greyhound.getDb('greyhound_spec')
      .then(function() {
        expect(greyhound.db().stringify()).toEqual('[]');
        done();
      });

      rootScope.$digest();
    });

    it('reads the actual DB if already exists', function(done) {
      // Skip if no window exists
      if(!window || !window.localStorage) {
        done();
        return;
      }

      window.localStorage[appConfig.storage.ns+'test'] = JSON.stringify({data: [{v: 111}, {v: 222}, {v: 333}]});

      greyhound.getDb('test')
      .then(function() {
        expect(greyhound.db().select('v')).toEqual([111, 222, 333]);
        done();
      });

      rootScope.$digest();
    });

    it('writes to the db', function(done) {
      // Skip if no window exists
      if(!window || !window.localStorage) {
        done();
        return;
      }

      spyOn(storage, 'setItem').and.callThrough();

      greyhound.getDb('greyhound_spec_54')
      .then(function() {
        return greyhound.save({food: 'korean sushi', rating: 5});
      })
      .then(function() {
        expect(storage.setItem.calls.argsFor(0)[1].data[0].food).toEqual('korean sushi');
        expect(storage.setItem.calls.argsFor(0)[1].data[0].rating).toEqual(5);
        return greyhound.save({food: 'langos', rating: 2});
      })
      .then(function() {
        expect(storage.setItem.calls.argsFor(1)[1].data[0].food).toEqual('korean sushi');
        expect(storage.setItem.calls.argsFor(1)[1].data[0].rating).toEqual(5);
        expect(storage.setItem.calls.argsFor(1)[1].data[1].food).toEqual('langos');
        expect(storage.setItem.calls.argsFor(1)[1].data[1].rating).toEqual(2);
        expect(storage.setItem.calls.count()).toEqual(2);

        // test localStorage directly
        var lsData = JSON.parse($window.localStorage[greyhound.dbName]).data;
        expect(lsData[0].food).toBe('korean sushi');
        expect(lsData[0].rating).toBe(5);
        expect(lsData[1].food).toBe('langos');
        expect(lsData[1].rating).toBe(2);

        done();
      });

      rootScope.$digest();
    });

    it('new object will be empty without prototype', function() {
      var n = greyhound.new();
      expect(n).toEqual({});
    });

    it('new respects optional prototype', function() {
      var def = {
        food: 'chicken wrap',
        vendor: 'wrapper',
        weather: 'rainy'
      };

      var n = greyhound.new(def);

      expect(n.food).toBeDefined();
      expect(n.food).toBe('chicken wrap');
      expect(n.vendor).toBeDefined();
      expect(n.vendor).toBe('wrapper');
      expect(n.weather).toBeDefined();
      expect(n.weather).toBe('rainy');
    });

    it('can select by any key in getOneBy()', function(done) {
      greyhound.getDb('greyhound_spec_105')
      .then(function() {
        return greyhound.save({uuid: 'D83598F0-A9D4-11E3-AF16-C6D7DB0F677B', text: 'getOneBy works'});
      })
      .then(function() {
        var record = greyhound.getOneBy('uuid', 'D83598F0-A9D4-11E3-AF16-C6D7DB0F677B');
        expect(record.uuid).toBe('D83598F0-A9D4-11E3-AF16-C6D7DB0F677B');
        expect(record.text).toBe('getOneBy works');
        done();
      });

      rootScope.$digest();
    });

    it('.getDb can use dbName from this.config', function(done) {
      var someDbProto = function() {
        this.config = {dbName: 'somename', ns: appConfig.storage.ns};
      };

      someDbProto.prototype = new greyhoundProto(appConfig.storage); // jshint ignore:line
      var someDb = new someDbProto(); // jshint ignore:line

      someDb.getDb()
      .then(function() {
        expect(someDb.dbName).toBe(appConfig.storage.ns+someDb.config.dbName);
        done();
      });

      rootScope.$digest();
    });

    it('.getDb can use dbName from argument', function(done) {
      var someDbProto = function() {};

      someDbProto.prototype = new greyhoundProto(appConfig.storage); // jshint ignore:line
      var someDb = new someDbProto(); // jshint ignore:line

      someDb.getDb('Orchestra')
      .then(function() {
        expect(someDb.dbName).toBe(appConfig.storage.ns+'Orchestra');
        done();
      });

      rootScope.$digest();
    });

    it('.getDb throws exception if dbName is not set', function(done) {
      var someDbProto = function() {};

      someDbProto.prototype = new greyhoundProto(appConfig.storage); // jshint ignore:line
      var someDb = new someDbProto(); // jshint ignore:line

      expect(function() {
        someDb.getDb();
      }).toThrow();
      done();

      rootScope.$digest();
    });

    /** greyhound.getAll({...}, {...}) */
    it('can return all records with getAll()', function(done) {
      greyhound.getDb('greyhound_spec_getall')
      .then(function() {
        return greyhound.save({id: '001', text: 'Something One', timestamp: 123456789});
      })
      .then(function() {
        return greyhound.save({id: '002', text: 'Something Two', timestamp: 113456789});
      })
      .then(function() {
        return greyhound.save({id: '003', text: 'Something Three', timestamp: 223456789});
      })
      .then(function() {
        var all;
        all = greyhound.getAll();
        expect(all.length).toBe(3);
        expect(all[0].id).toBe('001');
        expect(all[0].text).toBe('Something One');
        expect(all[1].id).toBe('002');
        expect(all[1].text).toBe('Something Two');
        expect(all[2].id).toBe('003');
        expect(all[2].text).toBe('Something Three');

        all = greyhound.getAll({limit: 1});
        expect(all.length).toBe(1);
        expect(all[0].id).toBe('001');
        expect(all[0].text).toBe('Something One');

        all = greyhound.getAll({start: 2, limit: 2});
        expect(all.length).toBe(2);
        expect(all[0].id).toBe('002');
        expect(all[1].id).toBe('003');

        all = greyhound.getAll({start: 1, limit: 2});
        expect(all.length).toBe(2);
        expect(all[0].id).toBe('001');

        all = greyhound.getAll({start: 1, limit: 2, filter: {id: '002'}});
        expect(all.length).toBe(1);
        expect(all[0].id).toBe('002');

        all = greyhound.getAll({order: 'timestamp'});
        expect(all.length).toBe(3);
        expect(all[0].id).toBe('002');
        expect(all[1].id).toBe('001');
        expect(all[2].id).toBe('003');

        done();
      });

      rootScope.$digest();
    });

    it('getDB rejects on TaffyDB error', function(done) {
      spyOn(greyhound, 'database').and.throwError('Argh!');

      greyhound.getDb('FifthApe')
      .then(null, function(e) {
        expect(e).toMatch('Can\'t create TaffyDB for FifthApe');
        done();
      });
    });

    it('getDB rejects on LocalForage error', function(done) {
      spyOn(greyhound.storage, 'getItem').and.callFake(function() {
        return Q.fcall(function() {
          throw new Error('Argh!');
        });
      });

      greyhound.getDb('FifthApe')
      .then(null, function(e) {
        expect(e).toMatch('Can\'t get LocalForage for FifthApe');
        done();
      });
    });

    it('saveDb rejects on error', function(done) {
      spyOn(greyhound.storage, 'setItem').and.callFake(function() {
        return Q.fcall(function() {
          throw new Error('Argh!');
        });
      });

      greyhound.getDb('FifthApe')
      .then(function() {
        return greyhound.save({id: 1, name: 'Monkey'});
      })
      .then(null, function(e) {
        expect(e).toMatch('Error while saving');
        done();
      });
    });

    it('removeDb rejects on error', function(done) {
      spyOn(greyhound.storage, 'removeItem').and.callFake(function() {
        return Q.fcall(function() {
          throw new Error('Argh!');
        });
      });

      greyhound.getDb('FifthApe')
      .then(function() {
        return greyhound.save({id: 1, name: 'Monkey'});
      })
      .then(function() {
        return greyhound.removeDb();
      })
      .then(null, function(e) {
        expect(e).toMatch('Error removing DB');
        done();
      });
    });

  });
})();
