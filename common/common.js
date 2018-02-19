angular.module('app').component('common', {
  templateUrl: './common/common.html',
  controller: Common
  // bindings: {}
})
Common.$inject = ['contentGraphService', '$state', 'commonService', '$scope']

function Common(contentGraphService, $state, commonService, $scope) {
  var ctrl = this

  ctrl.defaultLat = 48.71875
  ctrl.defaultLng = -122.09375

  // ctrl.getStartEndDates = commonService.getStartEndDates(ctrl.continueInit)

  ctrl.$onInit = function() {
    console.log("common init")
    /*2 way bindings*/
    //graph, will need these from toolbar
    commonService.getStartEndDates(ctrl.continueInit)
    // commonService.getStartEndDates(ctrl.continueInit)
  }

  ctrl.continueInit = function() {
    console.log("continueInit start")
    // ctrl.defaultBfw = 30
    // ctrl.defaultDesignLifetime = 2050
    // ctrl.defaultBfwDesign = 32

    //toolbar, graph, will need lat and lon from map click from mapService
    ctrl.coords = {
      lat: ctrl.defaultLat,
      lng: ctrl.defaultLng
    }

    //graph will need threshold from toolbar (so bind this to graph and toolbar)
    ctrl.threshold = 1.0

    // this needed to update display in child component toolbare
    ctrl.startYear = commonService.startYear
    ctrl.endYear = commonService.endYear
    console.log("just before apply in cb from commonService.getStartEndDates, ", commonService.startYear, commonService.endYear)
    $scope.$apply()
  }

  // ctrl.getStartEndDates = function(cb) {
  //   d3.csv("./contentGraph/ratio00.csv", function(error, data) {
  //     if (error) throw error;
  //     let keys = Object.keys(data[0])
  //     ctrl.startYear = parseInt(keys[0])            //2014
  //     ctrl.endYear = parseInt(keys[keys.length-2])  //2090
  //
  //     commonService.startYear = ctrl.startYear
  //     commonService.endYear = ctrl.endYear
  //
  //     console.log("start and end year from commonService: ", commonService.startYear, commonService.endYear)
  //     cb()
  //   })
  // }


  //inherited by contentMap and contentGraph components
  ctrl.genGraph = function() {
    console.log("hello from inherited genGraph")
    //build graph
    contentGraphService.updateRatiosGraph()
    contentGraphService.updateProbabilityGraph()
  }
}
