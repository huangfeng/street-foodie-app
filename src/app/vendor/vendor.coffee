vendorModule = angular.module 'app.vendor', []

vendorModule.config (appConfig, $routeProvider) ->
  $routeProvider
  .when appConfig.vendor.url.list,
    {
      templateUrl: 'vendor/vendor_list.tpl.html'
      controller: 'vendorCtrl'
    }

vendorModule.controller 'vendorCtrl', ($scope, $http) ->
  $scope.app.title = 'Vendors'
  $scope.app.titleback = true

  $scope.page =
    loading: true

  # Load vendor data JSON
  $http.get 'assets/data/vendors.json', {cache: true}

  .success (vendors) ->
    # vendors.forEach (v) ->
    v.picture = 'assets/contentmedia/vendors/'+v.twitter.toLowerCase()+'_42.jpg' for v in vendors

    $scope.vendors = vendors

  .error (e) ->
    console.log e

  .finally ->
    $scope.page.loading = false

  $scope.$on 'listModal.open', (event, item) ->
    $scope.app.titlebackCb = ->
      $scope.$emit 'listModal.close', item

  $scope.$on 'listModal.close', ->
    $scope.app.titlebackCb = null
