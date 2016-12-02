// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngMessages', 'starter.controllers', 'starter.services', 'starter.filters', 'relativeDate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl :'templates/login.html',
    controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'BaseCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.inbox', {
    url: '/inbox',
    views:{
      'tab-inbox':{
        templateUrl: 'templates/tab-inbox.html',
        controller: 'InboxCtrl'
      }
    }
  })

  .state('tab.message', {
    url: '/inbox/:messageId',
    views:{
      'tab-inbox':{
        templateUrl: 'templates/message.html',
        controller: 'MessageCtrl'
      }
    }
  })

  .state('tab.geofences', {
    url: '/geofences',
    views:{
      'tab-geofences':{
        templateUrl: 'templates/tab-geofences.html',
        controller: 'GeofencesCtrl'
      }
    }
  })

  .state('tab.beacons', {
    url: '/beacons',
    views:{
      'tab-beacons':{
        templateUrl: 'templates/tab-beacons.html',
        controller: 'BeaconsCtrl'
      }
    }
  })

  .state('tab.workspaces', {
    url: '/workspaces',
    views:{
      'tab-workspaces':{
        templateUrl: 'templates/tab-workspaces.html',
        controller: 'WorkspacesCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/inbox');

});
