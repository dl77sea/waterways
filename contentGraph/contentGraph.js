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

function ContentGraph(contentGraphService, $state, $stateParams) {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("content graph init")
    console.log()
    ctrl.defaultStartYear = 2014
    ctrl.defaultEndYear = 2090
    ctrl.defaultCurrentBfw = 30
    ctrl.defaultBfwDesign = 32
    ctrl.defaultDesignLifetime = 2060

    //&startYear&endYear&threshold&designLifetime&bfwDesign
    if($stateParams.startYear === undefined) {
      ctrl.startYear = ctrl.defaultStartYear
    } else {
      ctrl.startYear = $stateParams.startYear
    }
    if($stateParams.endYear === undefined) {
      ctrl.startYear = ctrl.defaultEndYear
    } else {
      ctrl.startYear = $stateParams.endYear
    }
    if($stateParams.currentBfw === undefined) {
      ctrl.currentBfw = ctrl.defaultCurrentBfw
    } else {
      ctrl.currentBfw = $stateParams.currentBfw
    }
    if($stateParams.bfwDesign === undefined) {
      ctrl.bfwDesign = ctrl.defaultBfwDesign
    } else {
      ctrl.bfwDesign = $stateParams.bfwDesign
    }
    if($stateParams.designLifetime === undefined) {
      ctrl.designLifetime = ctrl.defaultDesignLifetime
    } else {
      ctrl.designLifetime = $stateParams.designLifetime
    }

    contentGraphService.initRatiosGraph(ctrl.startYear, ctrl.endYear, ctrl.currentBfw, ctrl.designLifetime, ctrl.bfwDesign)

    // console.log(document.getElementById)
    // ctrl.setGraphVals()
    ctrl.updateGraphs()
  }

  ctrl.updateGraphs = function() {
    console.log("hello from ctrl.updateGraphs")
    $state.go('contentGraph',
    {
      endYear: ctrl.endYear,
      currentBfw: ctrl.currentBfw,
      designLifetime: ctrl.designLifetime,
      bfwDesign: ctrl.bfwDesign,
      notify: false,
      reloadOnSearch: false}
    )
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
ContentGraph.$inject = ['contentGraphService', '$state', '$stateParams']
