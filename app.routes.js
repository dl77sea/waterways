(function() {
  'use strict';

  angular.module('app').config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

  function config($stateProvider, $urlRouterProvider, $locationProvider){

    // this line is optional
    $locationProvider.html5Mode(true)

    $stateProvider
      .state({
        name: 'common',
        url: '/',
        component: 'common',
      })
      // .state({ name: 'location', url: '/location', component: 'location' })
      // .state({ name: 'orders', url: '/my-orders', component: 'orders' })
      // .state({ name: 'cart', url: '/my-cart', component: 'cart' })

  }


}());
