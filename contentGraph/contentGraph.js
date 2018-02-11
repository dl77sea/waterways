angular.module('app').component('contentGraph', {
  templateUrl: './contentGraph/contentGraph.html',
  controller: ContentGraph
  // bindings: {
  //   editMode: '=',
  //   startYear: '=',
  //   endYear: '=',
  //   currentBfw: '=',
  //   designLifetime: '=',
  //   bfwDesign: '=',
  //   genGraph: '&'
  // }
})

function ContentGraph(contentGraphService, $state) {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("content graph init")
    ctrl.startYear = 2014;
    ctrl.endYear = 2090
    ctrl.currentBfw = 30
    ctrl.bfwDesign = 32
    ctrl.designLifetime = 2060
    contentGraphService.initRatiosGraph(2014, 2090, 30, 2060, 32)

    // console.log(document.getElementById)
    // ctrl.setGraphVals()
    ctrl.updateGraphs()
  }

  ctrl.updateGraphs = function() {
    ctrl.setGraphVals()
    // ctrl.genGraph()
    contentGraphService.updateRatiosGraph()
    contentGraphService.updateProbabilityGraph()

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
ContentGraph.$inject = ['contentGraphService', '$state']
