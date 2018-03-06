angular.module('app').component('common', {
  templateUrl: './common/common.html',
  controller: Common
  // bindings: {}
})
Common.$inject = ['contentGraphService', '$state', 'commonService', '$scope']

function Common(contentGraphService, $state, commonService, $scope) {
  var ctrl = this

  ctrl.defaultLat = 45.65625
  ctrl.defaultLng = -121.09375

  ctrl.$onInit = function() {
    commonService.getStartEndDates()
    ctrl.coords = {
      lat: ctrl.defaultLat,
      lng: ctrl.defaultLng
    }
    ctrl.threshold = 1.0
    ctrl.startYear = commonService.startYear+1
    ctrl.endYear = commonService.endYear
  }

  ctrl.genGraph = function() {
    contentGraphService.updateRatiosGraph()
    contentGraphService.updateProbabilityGraph()
  }
}
