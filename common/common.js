angular.module('app').component('common', {
  templateUrl: './common/common.html',
  controller: Common
  // bindings: {}
})
Common.$inject = ['contentGraphService', '$state']

function Common(contentGraphService, $state) {
  var ctrl = this

  ctrl.defaultLat = 48.71875
  ctrl.defaultLng = -122.09375

  ctrl.lattt = {
    val: 123
  }

  ctrl.$onInit = function() {
    console.log("common init")
    /*2 way bindings*/
    //graph, will need these from toolbar
    ctrl.defaultYearFrom = 2014
    ctrl.defaultYearTo = 2090

    ctrl.defaultBfw = 30
    ctrl.defaultDesignLifetime = 2050
    ctrl.defaultBfwDesign = 32

    //toolbar, graph, will need lat and lon from map click from mapService
    ctrl.coords = {
      lat: ctrl.defaultLat,
      lng: ctrl.defaultLng
    }

    //footer needs edit mode
    ctrl.mode = {
      mode: "map"
    }
    ctrl.editMode = ctrl.mode

    //graph will need threshold from toolbar (so bind this to graph and toolbar)
    ctrl.threshold = 1.0

    console.log("just before #state.go")
    $state.go('common-top.content-map')
  }

  //inherited by contentMap and contentGraph components
  ctrl.genGraph = function() {
    console.log("hello from inherited genGraph")
    //build graph
    contentGraphService.updateRatiosGraph()
    contentGraphService.updateProbabilityGraph()
  }
}
