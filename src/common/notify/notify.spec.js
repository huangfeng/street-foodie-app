(function() {
  'use strict';

  describe('Notify module', function() {
    var $compile; // jshint camelcase: false
    var $scope;
    var template;
    var notify;
    var notifyConfig;
    var $window;

    /** Load all required modules and templates */
    beforeEach(module('templates'));
    beforeEach(module('notify'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _notify_, _notifyConfig_, _$window_) {
      $compile = _$compile_;

      /** Create a new scope for each test */
      $scope = _$rootScope_.$new();

      /** The module & configuration constant */
      notify = _notify_;
      notifyConfig = _notifyConfig_;

      $window = _$window_;
    }));

    beforeEach(function() {
      /** Template string as we would use in a page */
      template = '<notify></notify>';
    });

    beforeEach(function() {
      notify.flush();
    });

    it('displays an "info" message by default', function() {
      notify.push('hello dolly');

      var element = $compile(template)($scope);
      $scope.$digest();

      var section = element.find('section');
      var messages = angular.element(section).find('div');
      expect(messages.length).toEqual(1);
      expect(angular.element(messages[0]).hasClass('alert')).toBe(true);
      expect(angular.element(messages[0]).hasClass('alert-dismissable')).toBe(true);
      expect(angular.element(messages[0]).hasClass(notifyConfig.type[notifyConfig.defaultType].cssClass)).toBe(true);
    });

    it('handles message types', function() {
      notify.push('hello info', 'info');
      notify.push('hello success', 'success');
      notify.push('hello warning', 'warning');
      notify.push('hello danger', 'danger');

      var element = $compile(template)($scope);
      $scope.$digest();

      var section = element.find('section');
      var messages = angular.element(section).find('div');
      expect(messages.length).toEqual(4);
      expect(angular.element(messages[0]).hasClass(notifyConfig.type.info.cssClass)).toBe(true);
      expect(angular.element(messages[1]).hasClass(notifyConfig.type.success.cssClass)).toBe(true);
      expect(angular.element(messages[2]).hasClass(notifyConfig.type.warning.cssClass)).toBe(true);
      expect(angular.element(messages[3]).hasClass(notifyConfig.type.danger.cssClass)).toBe(true);
    });

    it('handles message text', function() {
      notify.push('abc info', 'info');
      notify.push('def success', 'success');
      notify.push('ghi warning', 'warning');
      notify.push('jkl danger', 'danger');

      var element = $compile(template)($scope);
      $scope.$digest();

      var section = element.find('section');
      var messages = angular.element(section).find('div');
      expect(messages.length).toEqual(4);
      expect(angular.element(messages[0]).text()).toMatch('abc');
      expect(angular.element(messages[1]).text()).toMatch('def');
      expect(angular.element(messages[2]).text()).toMatch('ghi');
      expect(angular.element(messages[3]).text()).toMatch('jkl');
    });

    it('deletes on click', function() {
      var section, messages, element, click;

      notify.push('abc info', 'info');
      notify.push('def success', 'success');
      notify.push('ghi warning', 'warning');
      notify.push('jkl danger', 'danger');

      element = $compile(template)($scope);
      $scope.$digest();

      section = element.find('section');
      messages = angular.element(section).find('div');
      expect(messages.length).toEqual(4);

      click = $window.document.createEvent('Event');
      click.initEvent('click', true, true);

      messages[0].dispatchEvent(click);
      section = element.find('section');
      messages = angular.element(section).find('div');
      expect(messages.length).toEqual(3);

      messages[0].dispatchEvent(click);
      section = element.find('section');
      messages = angular.element(section).find('div');
      expect(messages.length).toEqual(2);

      messages[0].dispatchEvent(click);
      section = element.find('section');
      messages = angular.element(section).find('div');
      expect(messages.length).toEqual(1);

      messages[0].dispatchEvent(click);
      section = element.find('section');
      messages = angular.element(section).find('div');
      expect(messages.length).toEqual(0);
    });

    it('throws on invalid message text', function() {
      expect(function() {
        notify.push([1,2,3], 'info');
      }).toThrow();

      expect(function() {
        notify.push(1, 'info');
      }).toThrow();

      expect(function() {
        notify.push({a:1}, 'info');
      }).toThrow();
    });

    // Test if Telerik Toas plugin for PhoneGap is picked up
    it('uses Telerik Toast when available', function() {
      $window.plugins = {
        toast: {
          showLongBottom: function(){}
        }
      };

      spyOn($window.plugins.toast, 'showLongBottom');

      notify.push('Drank my Kenya coffee');

      expect($window.plugins.toast.showLongBottom).toHaveBeenCalled();
      expect($window.plugins.toast.showLongBottom).toHaveBeenCalledWith('Drank my Kenya coffee');
    });

  });
})();
