angular.module('app').component('contentGraph', {
  templateUrl: './contentGraph/contentGraph.html',
  controller: ContentGraph,
  bindings: {
    editMode: '=',
    startYear: '=',
    endYear: '=',
    currentBfw: '=',
    designLifetime: '=',
    bfwDesign: '=',
    genGraph: '&'
  }
})

function ContentGraph(contentGraphService) {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("content graph init")

    ctrl.setGraphVals()
    contentGraphService.initRatiosGraph()
  }

  ctrl.updateGraphs = function() {
    ctrl.setGraphVals()
    ctrl.genGraph()
  }

  ctrl.setGraphVals = function() {
    //used for prob thresh
    contentGraphService.threshold = ctrl.bfwDesign
    //used for csv mult
    contentGraphService.currentBfw = ctrl.currentBfw
    //used for prob ind
    contentGraphService.designLifetime = ctrl.designLifetime
  }
}
ContentGraph.$inject = ['contentGraphService']
