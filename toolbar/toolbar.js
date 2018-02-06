function Toolbar(contentGraphService) {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("toolbar init")

    //from common
    // ctrl.threshold = 1.0
    ctrl.tbCoords = ctrl.coords
  }

  ctrl.clickGenGraph = function() {
    console.log("click gengraph")
    console.log("lattt from toolbar: ", ctrl.lattt)

    contentGraphService.threshold = ctrl.bfwDesign

    //build graph
    contentGraphService.updateRatiosGraph()
    contentGraphService.updateProbabilityGraph()

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
    startYear: '=',
    endYear: '=',
    currentBfw: '=',
    designLifetime: '=',
    bfwDesign: '='
  }
})

Toolbar.$inject = ['contentGraphService']
