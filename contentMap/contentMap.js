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

    // commonService.editMode.mode = "map"

    // ctrl.defaultLat = 47.34375
    // ctrl.defaultLng = -120.78125
    // ctrl.coords = {
    //   lat: ctrl.defaultLat,
    //   lng: ctrl.defaultLng
    // }
    //
    // ctrl.gridInc = 0.0625 / 2

    ctrl.$onInit = function() {
      // contentMapService.buildMap()
      contentMapService.initMap()
    }

  }

}());
