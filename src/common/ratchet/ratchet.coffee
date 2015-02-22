# Rathect helper module
"use strict"

ratchetModule = angular.module 'ratchet', []

# Directive to create an accordion-like table view
# tableAccordionWrap is added to the parent <ul> element
# eg. `<ul class="table-view" table-accordion-wrap>`
# It will act as a parent scope to mediate messages
# between elements
ratchetModule.directive 'tableAccordionWrap', ->

  {
    restrict: 'A'

    controller: ($scope) ->
      @tableAccordion = {
        # State of elements in array, true if open
        opened: []
      }

      @closeAll = ->
        $scope.$broadcast 'tableAccordion.close'

      @openEvent = (num) ->
        $scope.$emit 'tableAccordion.open', num

      @closeEvent = (num) ->
        $scope.$emit 'tableAccordion.close', num

      # Counter of elements
      @count = 0
  }

# Directive added to the clickable accordion headers
# eg. `<li class="table-view-cell" ng-repeat="market in markets" table-accordion-elem>`
# Clicking an element will remove `active` CSS class from all others
ratchetModule.directive 'tableAccordionElem', ->

  {
    restrict: 'A'

    require: '^tableAccordionWrap'

    link: (scope, elem, attrs, tableAccordionWrap) ->
      scope.tableAccordionNum = tableAccordionWrap.count
      tableAccordionWrap.count++

      scope.closeAll = tableAccordionWrap.closeAll
      scope.openEvent = tableAccordionWrap.openEvent
      scope.closeEvent = tableAccordionWrap.closeEvent
      scope.opened = tableAccordionWrap.tableAccordion.opened[scope.tableAccordionNum]

    controller: ($scope, $element, $attrs) ->

      $scope.$on 'tableAccordion.close', ->
        $element.removeClass 'active'

      # Listen to click events on the `<a class="navigate-right">`
      # This will open/close the accordion
      $element.find('a').on 'click', (event) ->
        return true if not angular.element(event.target).hasClass('navigate-right')
        $scope.opened = true

        if $element.hasClass 'active'
          wasActive = true

        $scope.closeAll()

        if wasActive
          $element.removeClass 'active'
          $scope.closeEvent($scope.tableAccordionNum)
        else
          $element.addClass 'active'
          $scope.openEvent($scope.tableAccordionNum)

        $scope.$apply()
  }

# Directive to toggle an image to be shown in the full content area
# eg. when users visits a food-show page, they can click on the photo
# and a new layer with the photo will cover the content area
# Clicking the big photo hides it
# This directive `picmodalTrigger` will trigger the `picmodal.open` event.
# Example:
# ```
# <a picmodal-trigger>Click!</a>
# ```
ratchetModule.directive 'picmodalTrigger', ->

  {
    restrict: 'A',

    controller: ($scope, $element) ->
      $element.on 'click', ->
        $scope.$emit 'picmodal.open'
  }

# `picmodalElement` is an element directive, it contains the
# HTML content to show full screen
# Requires Ratchet CSS to be loaded, since we use `modal` and `modal.active`
# classes. See `ratchet.less`.
# Example:
# ```
# <picmodal-element>Hello</picmodal-element>
# ```
ratchetModule.directive 'picmodalElement', ->

  {
    restrict: 'E'

    controller: ($scope, $element) ->
      $element.addClass 'modal'

      $element.on 'click', ->
        $scope.$emit 'picmodal.close'

      $scope.$on 'picmodal.open', ->
        $element.addClass 'active'

      $scope.$on 'picmodal.close', ->
        $element.removeClass 'active'

  }

# Directive to link a different modal to each element of a list
# Example (all classes are required!):
# ```
# <div list-modal>
#   <a ng-repeat="vendor in vendors" list-modal-trigger="vendor">{{vendor.name}}</a>
#
#   <div class="modal" list-modal-target>
#     Larger HTML content hidden by default. {{item}} here refers to the `vendor`
#     above.
#   </div>
# </div>
# ```
#
# Requires Ratchet CSS.
#
# The `vendor` in the example can be any object or probably any string, it will
# be compared by `===`, and only the matching modal will open.
#
# Modals are opened by adding `active` class (comes from Ratchet)
#
# This directive it the wrapper for both below
ratchetModule.directive 'listModal', ->

  {
    restrict: 'A'

    controller: ($scope) ->
      @scope =
        events:
          open: (item) ->
            $scope.$emit 'listModal.open', item
          close: ->
            $scope.$emit 'listModal.close'
  }

# Trigger directive for listModal
ratchetModule.directive 'listModalTrigger', ->

  {
    restrict: 'A'

    scope: {
      item: '=listModalTrigger'
    }

    require: '^listModal'

    link: (scope, elem, attrs, listModal) ->
      # Copy the parent directive controller's `this` into scope
      scope.listModal = listModal.scope

    controller: ($scope, $element, $attrs) ->
      # Send the current item to the open event on click
      $element.on 'click', ->
        $scope.listModal.events.open $scope.item

  }

# Target directive for listModal - this will receive the css class `active`
ratchetModule.directive 'listModalTarget', ->

  {
    restrict: 'A'

    require: '^listModal'

    link: (scope, elem, attrs, listModal) ->
      scope.listModal = listModal.scope

    controller: ($scope, $element, $attrs, $window) ->
      # Pick up the item from the event and assig it to $scope
      $scope.$on 'listModal.open', (event, item) ->
        $scope.item = item
        $scope.$apply()
        $element.addClass 'active'
        # Listener for the Android `backbutton` event
        # Emulate: `document.dispatchEvent(new Event('backbutton'))`
        $window.document.addEventListener 'backbutton', backButtonCb, false

      $scope.$on 'listModal.close', (event) ->
        $element.removeClass 'active'
        $window.document.removeEventListener 'backbutton', backButtonCb, false

      # the `backbutton` callback
      backButtonCb = ->
        $scope.listModal.events.close()
  }
