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
        name: 'contentMap',
        // template: '<content-map></content-map>',
        url: '/',
        component: 'contentMap'
        // controller: 'ContentMap',
        // template: '<contentMap></contentMap>',
        // parent: 'common',
        // snarfParams: {
        //   obj: null
        // },
        // url: "/contacts/:contactId",
        //  template: './contentMap/contentMap.html',
        //  controller: function ($stateParams) {
        //      console.log($stateParams);
        //  }
        // component: 'contentMap'
      })
      .state({
        name: 'contentGraph',
        url: '/graph/?lat&lng&startYear&endYear&currentBfw&designLifetime&bfwDesign',        
        component: 'contentGraph'
      })
    // .state({ name: 'orders', url: '/my-orders', component: 'orders' })
    //      lat: 123,
          // lng: formattedLng,
          // startYear: 2014,
          // endYear: 2090,
          // currentBfw: 32,
          // designLifetime: 2060,
          // bfwDesign: 30})

    // .state({ name: 'cart', url: '/my-cart', component: 'cart' })
    // edit-mode="$ctrl.editMode" coords="$ctrl.coords" gen-graph="$ctrl.genGraph()"
  }


}());
