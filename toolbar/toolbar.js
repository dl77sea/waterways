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

    console.log("ctrl.designLifetime ", ctrl.designLifetime)
    console.log("ctrl.currentBfw ", ctrl.currentBfw)
    console.log("ctrl.bfwDesign ", ctrl.bfwDesign)

    //used for prob thresh
    contentGraphService.threshold = ctrl.bfwDesign

    //used for csv mult
    contentGraphService.currentBfw = ctrl.currentBfw

    //used for prob ind
    contentGraphService.designLifetime = ctrl.designLifetime


    // contentGraphService.bfwDesign = ctrl.bfwDesign

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
