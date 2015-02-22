marketModule = angular.module 'app.market', []

marketModule.config (appConfig, $routeProvider) ->
  $routeProvider
  .when appConfig.market.url.list,
    {
      templateUrl: 'market/market_list.tpl.html'
      controller: 'marketListCtrl'
    }

marketModule.controller 'marketListCtrl', ($scope, $http, $window) ->

  $scope.app.title = 'Markets'
  $scope.app.titleback = true

  $scope.page =
    loading: true
    # Hide the map till we have data
    mapready: false

  # Market list for view
  $scope.markets = [];

  # Map data to link market list to map pins
  # [ [marker, infoWindow], [...], ... ]
  map =
    map: null
    markers: []
    # Reference to the open infowindow
    infoWindowOpen: null

  # When clicking a market list item, open and focus on the corresponding
  # map infoWindow. On the 2nd click of the same market item, close the
  # infoWindow
  # We do this by listening to tableaccordion events (see `ratchet.js`)
  $scope.$on 'tableAccordion.open', (e, num) ->
    showMapInfoWindow num

  # Close the info window above the marker when closing the market list item
  $scope.$on 'tableAccordion.close', (e, num) ->
    # I like it better if closing the market list item leaves the map iw open
    # so these are turned off:
    # map.infoWindowOpen.close() if map.infoWindowOpen?
    # map.infoWindowOpen = null

  # Open the info window when clicking the marker on the map
  showMapInfoWindow = (num) ->
    map.infoWindowOpen.close() if map.infoWindowOpen? and map.infoWindowOpen != map.markers[num][1]
    map.markers[num][1].open map.map, map.markers[num][0]
    map.infoWindowOpen = map.markers[num][1]

  # Load market data JSON
  $http.get 'assets/data/markets.json', {cache: true}

  .success (markets) ->
    $scope.markets = markets
    loadMap markets

  .error (e) ->
    console.log e

  .finally ->
    $scope.page.loading = false;

  # Add map using Google Maps API to page
  loadMap = (data) ->
    if $window.google?.maps?

      # Map init options
      # @todo move to configuration
      mapOptions =
        center:
          lat: 51.5054471
          lng: -0.1003256
        zoom: 11

      map.map = new $window.google.maps.Map document.getElementById('map'), mapOptions

      # Push a pin for each market
      data.forEach (d) ->

        _d = map.markers.length
        marker = makeMarker map.map, d.map.lat, d.map.lng, d.name
        _extUrl = makeMapUrl d.map.lat, d.map.lng, d.name
        infoWindow = makeInfoWindow """
          <div class="infoWindow">
            <i class="fa fa-external-link" onclick="window.open('#{_extUrl}', '_system');"></i>
            <h1>#{d.name}</h1>
          </div>
          """
        map.markers.push [marker, infoWindow]

        $window.google.maps.event.addListener marker, 'click', ->
          showMapInfoWindow _d

      # Now the map is ready
      $scope.page.mapready = true

      # Resize the map so it looks nice even after coming back to the page
      mapFix = ->
        if $scope.app.vendor.mapFixRequired is false
          $scope.app.vendor.mapFixRequired = true
          return false
        google.maps.event.trigger map.map, 'resize'
        map.map.setCenter mapOptions.center

      $window.setTimeout mapFix, 100

  makeMarker = (map, lat, lng, name) ->
    new $window.google.maps.Marker
      position:
        lat: lat
        lng: lng
      map: map
      title: name

  makeInfoWindow = (content) ->
    new $window.google.maps.InfoWindow
      content: content

  # Returns a Google Maps URL pointing to the specified market
  makeMapUrl = (lat, lng, name, zoom) ->
    zoom ?= 17
    name = $window.encodeURI name
    name = name.replace '"', '%22'
    name = name.replace '\'', '%27'
    "https://www.google.co.uk/maps/place/#{name}/@#{lat},#{lng},#{zoom}z"

  $scope.openMapExternal = (market) ->
    $scope.app.openExternal(makeMapUrl market.map.lat, market.map.lng, market.name)
