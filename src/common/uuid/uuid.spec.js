(function() {
  'use strict';

  describe('UUID module', function() {
    var uuid;
    var uuidRegExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

    beforeEach(module('uuid'));
    beforeEach(inject(function(_uuid_) {
      uuid = _uuid_;
    }));

    it('generates valid UUIDs', function() {
      expect(uuid.generate()).toMatch(uuidRegExp);
    });

    it('generates unique UUIDs', function() {
      expect(uuid.generate()).not.toMatch(uuid.generate());
    });
  });
})();
