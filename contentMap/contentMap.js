(function() {
  'use strict';

  angular.module('app').component('contentMap', {
    templateUrl: './contentMap/contentMap.html',
    controller: ContentMap
    // bindings: {
    // lattt: '=',
    // coords: '=',
    // editMode: '=',
    // genGraph: '&'
    // }
  })

  ContentMap.$inject = ['$scope', 'contentGraphService', '$state', '$stateParams', 'commonService', 'contentMapService']

  function ContentMap($scope, contentGraphService, $state, $stateParams, commonService, contentMapService) {
    var ctrl = this

    ctrl.$onInit = function() {
      contentMapService.initMap()
    }

  }

}());
