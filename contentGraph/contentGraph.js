angular.module('app').component('contentGraph', {
  templateUrl: './contentGraph/contentGraph.html',
  controller: ContentGraph,
  bindings: {
    editMode: '=',
    startYear: '=',
    endYear: '=',
    currentBfw: '=',
    designLifetime: '=',
    bfwDesign: '='
  }
})

function ContentGraph(contentGraphService) {
  var ctrl = this
  ctrl.$onInit = function() {
    console.log("content graph init")
    //used for prob thresh
    contentGraphService.threshold = ctrl.bfwDesign

    //used for csv mult
    contentGraphService.currentBfw = ctrl.currentBfw

    //used for prob ind
    contentGraphService.designLifetime = ctrl.designLifetime


    contentGraphService.initRatiosGraph()
  }
}
ContentGraph.$inject = ['contentGraphService']
