function Toolbar(contentGraphService) {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("toolbar init")
    //from common
    // ctrl.threshold = 1.0
    ctrl.tbCoords = ctrl.coords
  }

  ctrl.clickGenGraph = function() {

    //build graph
    // contentGraphService.updateRatiosGraph()
    // contentGraphService.updateProbabilityGraph()
    ctrl.genGraph()
    //switch to show graph
    ctrl.editMode.mode = "graph"
  }
}

angular.module('app').component('toolbar', {
  templateUrl: './toolbar/toolbar.html',
  controller: Toolbar,
  bindings: {
    lattt: '=',
    editMode: '=',
    coords: '=',
    genGraph: '&'
  }
})

Toolbar.$inject = ['contentGraphService']
