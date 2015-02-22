// # Food module
// Contains all functionality to save, read and list food items
//
// Module name is `app.food`.
//
// Uses `app.foodDB` which is the persistance layer to save food items.
(function() {
  'use strict';
  angular.module('app.food', ['app.foodDB', 'appConfig', 'starrating', 'notify', 'pgCamera', 'socialSharing'])

    // ## Routes
    //
    // * New food: **/food/new**
    // * List food: **/food/list**
    // * Show food: **/food/show/UUID**
    // * Edit food: **/food/edit/UUID**
  .config(
    function(appConfig, $routeProvider) {
      $routeProvider
      .when(appConfig.food.url.edit,
        {
          templateUrl: 'food/food_new.tpl.html',
          controller: 'foodNewCtrl'
        }
      )
      .when(appConfig.food.url.new,
        {
          templateUrl: 'food/food_new.tpl.html',
          controller: 'foodNewCtrl'
        }
      )
      .when(appConfig.food.url.list,
        {
          templateUrl: 'food/food_list.tpl.html',
          controller: 'foodListCtrl'
        }
      )
      .when(appConfig.food.url.show,
        {
          templateUrl: 'food/food_show.tpl.html',
          controller: 'foodShowCtrl'
        }
      )
      ;
    })

  // ## New food controller
  // Displays food form and saves food
  //
  // Uses `notify` module to display feedback
  .controller('foodNewCtrl', function($scope, foodDB, $location, notify, appConfig, $window, $q, pgCameraCamera, $routeParams) {

    $scope.page = {loaded: false};

    $scope.app.title = '';
    $scope.app.titleback = true;
    $scope.foodForm = appConfig.food.foodForm;
    $scope.mFoodMoreOpen = false;

    // Will use `foodDB` to save the new food item
    var db = foodDB;

    // Is this an edit or new food?
    var mode = 'new';
    if(typeof $routeParams.uuid !== 'undefined') {
      mode = 'edit';
    }

    // Original food, used when editing, to check if rating is changed
    var originalFood = null;

    // Initialize an empty food item stub, so directives have access to it and
    // it can be watched. `starrating` directive would not work without this,
    // since the `db.getDb()` is an async call and the directive would be
    // displayed before there is anything to be processed in the directive.
    // So it would silently do nothing.
    $scope.food = {rating: 0};

    // Run food setup depending on if this is a new food or an edit:
    if(mode === 'new') {_newFood();}
    if(mode === 'edit') {_getFood();}

    function _newFood() {
      // Create a new, proper Food object with `FoodDB.new()` which will be
      // edited in the food form in the view.
      db.getDb()
      .then(function() {
        return db.new();
      })
      .then(function(newFood) {
        $scope.food = newFood;
        $scope.app.title = 'Record';
        $scope.page.loaded = true;
        $scope.$digest(); // We don't forget to $digest() after an async task
      });
    }

    function _getFood() {
      // Gets the database and loads the Food
      db.getDb()
      .then(function() {
        $scope.$apply(function() {
          $scope.food = db.getByUUID($routeParams.uuid);
          originalFood = angular.copy($scope.food);
          $scope.page.loaded = true;
          $scope.mFoodMoreOpen = true;
        });
      });
    }

    // Checks if the food form is dirty and pops up a confirm dialog
    // Function `clearNavAwayCheck()` can be used to clear the listener later in `saveFood`
    var clearNavAwayCheck = $scope.$on('$locationChangeStart', function(event) {
      if(_foodIsDirty($scope.food)) {
        if($window.confirm('Cancel and lose everything you typed in?')) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }
      }

      return true;
    });

    function _foodIsDirty() {
      return $scope.mFood.$dirty || (originalFood !== null && originalFood.rating !== $scope.food.rating);
    }

    // Method to save a Food and move to the show page. Takes a Food object.
    // Runs an async task.
    $scope.saveFood = function(food) {
      db.save(food).then(function() {
        $scope.$apply(function() {
          // Display notification
          notify.push('Food saved', 'success');
          // Remove confirmation check
          clearNavAwayCheck();
          // Change location
          $location.url(appConfig.food.url.show.replace(':uuid', food.uuid));
        });
        // Display a message about failure
      }, function() {
        notify.push('Unable to save food :(', 'danger');
      });
    };

    // Get a picture from camera and set the path to `food.picture` from camera
    $scope.imageFromCamera = function() {
      pgCameraCamera.takePhoto({folder: appConfig.photo.appFolder})
      .then(function(img) {
        $scope.food.picture = img;
      }, function(err) {
        // If the error is not "... cancelled"
        if(!(/cancelled/.test(err))) {
          notify.push('Failed to grab image: '+err, 'danger');
        }
      });
    };

    // Get a picture from user's photo gallery
    $scope.imageFromGallery = function() {
      pgCameraCamera.selectPhoto({folder: appConfig.photo.appFolder})
      .then(function(img) {
        $scope.food.picture = img;
      }, function(err) {
        // If the error is not "... cancelled"
        if(!(/cancelled/.test(err))) {
          notify.push('Failed to grab image: '+err, 'danger');
        }
      });
    };

  })

  // ## Food list controller
  // Displays the list of saved Food items
  .controller('foodListCtrl', function($scope, foodDB, appConfig) {

    // tells the view if the page data is available
    $scope.page = {loaded: false};

    $scope.app.title = 'Your gallery';
    $scope.app.titleback = true;

    // The food list container
    $scope.foodList = [];

    // Gets the database and loads a batch of food items
    foodDB.getDb()
    .then(function() {
      $scope.foodList = foodDB.getAll({limit: appConfig.food.listLimit, order: 'createdAt desc'});
      for (var i = $scope.foodList.length - 1; i >= 0; i--) {
        $scope.foodList[i].food = $scope.foodList[i].food.slice(0,19);
      }
      $scope.page.loaded = true;
      $scope.$digest();
    });

  })

  // ## Show food controller
  // Displays a Food item by UUID, which comes from the URL, eg.
  // `/#/food/show/01f70678-9148-404b-afcc-be8f94500267`
  .controller('foodShowCtrl', function($scope, foodDB, $routeParams, $window, notify, $location, appConfig, socialSharing) {

    $scope.page = {loaded: false};

    $scope.app.title = '';
    $scope.app.titleback = true;
    $scope.app.menu.icons.active = false;
    $scope.app.menu.more.inmenu = true;

    // Delete the food from database
    $scope.deleteFood = function() {
      if($window.confirm('Are you sure?') === true) {
        foodDB.db($scope.food).remove();
        foodDB.saveDb().then(function() {
          $scope.$apply(function() {
            notify.push('Food deleted', 'success');
            $location.path(appConfig.food.url.list);
          });
        });
      }
    };

    $scope.editFood = function() {
      $location.url(appConfig.food.url.edit.replace(':uuid', $scope.food.uuid));
    };

    $scope.share = {};

    $scope.share.general = function() {
      var txt = '';
      var subject = 'Check out this #streetfood';

      if($scope.food.food) {
        txt = $scope.food.food + ' ';
        subject = subject.replace('#streetfood', $scope.food.food);
      }
      txt +='#london #streetfood via @streetfoodieapp';

      socialSharing.share(txt, subject, $scope.food.picture, 'http://getfoodieapp.co');
    };

    // Defaults come from `app.js`
    $scope.app.menu.foodIcons = {
      active: true,
      shareFn: $scope.share.general,
      editFn: $scope.editFood,
      deleteFn: $scope.deleteFood
    };

    // Stub food item. See notes @ [New food controller](#new-food-controller)
    $scope.food = {rating: 0};

    // Gets the database and loads the Food
    foodDB.getDb()
    .then(function() {
      $scope.$apply(function() {
        $scope.food = foodDB.getByUUID($routeParams.uuid);
        if($scope.food === false) {
          $scope.go(appConfig.home.url.home);
        } else {
          $scope.page.loaded = true;
        }
      });
    });

  })

  ;
})();
