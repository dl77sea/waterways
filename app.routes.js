(function() {
  'use strict';

  angular.module('app').config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

  function config($stateProvider, $urlRouterProvider, $locationProvider) {

    // this line is optional
    $locationProvider.html5Mode(true)

    // $stateProvider
    //   .state({
    //     name: 'common-top',
    //     // abstract: true,
    //     url: '/home',
    //     component: 'common'
    //   })
    //   .state({
    //     name: 'content-map',
    //     url: '/',
    //     component: 'contentMap',
    //     parent:'common-top'
    //   })
    //   .state({
    //     name: 'content-graph',
    //     url: '/graph/?lat&lng&startYear&endYear&currentBfw&designLifetime&bfwDesign',
    //     component: 'contentGraph',
    //     parent:'common-top'
    //   })


      $stateProvider
        .state({
          name: 'common-top',
          abstract: true,
          // url: '/',
          component: 'common'
        })
        .state({
          name: 'common-top.content-map',
          url: '/home',
          component: 'contentMap'
          // parent:'common'
        })
        .state({
          name: 'common-top.content-graph',
          url: '/?lat&lng&startYear&endYear&currentBfw&designLifetime&bfwDesign',
          component: 'contentGraph'
          // parent:'common'
        })

  }


}());
