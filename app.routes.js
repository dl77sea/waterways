(function() {
  'use strict';

  angular.module('app').config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

  function config($stateProvider, $urlRouterProvider, $locationProvider) {

    // this line is optional
    $locationProvider.html5Mode(true)

    $stateProvider
      .state({
        name: 'common',
        abstract: true,
        component: 'common',
      })
      .state({
        name: 'content-map',
        url: '/map',
        component: 'contentMap'
      })
      .state({
        name: 'content-graph',
        url: '/map/?lat&lng&startYear&endYear&currentBfw&designLifetime&bfwDesign',
        component: 'contentGraph'
      })
  }


}());
