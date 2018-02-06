angular.module('app').component('common', {
  templateUrl: './common/common.html',
  controller: Common
  // bindings: {}
})

function Common(contentGraphService) {
  var ctrl = this

  ctrl.defaultLat = 48.71875
  ctrl.defaultLng = -122.09375


  ctrl.lattt = {val: 123}

  ctrl.$onInit = function() {
    console.log("common init")

    /*2 way bindings*/

    //graph, will need these from toolbar
    ctrl.defaultYearFrom = 2014
    ctrl.defaultYearTo = 2090

    //toolbar, graph, will need lat and lon from map click from mapService
    ctrl.coords = {lat: ctrl.defaultLat, lng: ctrl.defaultLng}


    //footer needs edit mode
    ctrl.mode = {mode: "map"}
    ctrl.editMode = ctrl.mode

    //graph will need threshold from toolbar (so bind this to graph and toolbar)
    ctrl.threshold = 1.0
  }
  //graphService will need a triggering method that lvies here
  //bound down to toolbar graph gen button
  ctrl.doGraphs = function() {

  }
  ctrl.blarfer = function() {
    console.log("from common: ",ctrl.lattt)
  }
}
