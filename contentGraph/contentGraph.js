angular.module('app').component('contentGraph', {
  templateUrl: './contentGraph/contentGraph.html',
  controller: ContentGraph,
  bindings: {editMode: '='}
})

function ContentGraph(contentGraphService) {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("content graph init")
    contentGraphService.initRatiosGraph()
  }
}
ContentGraph.$inject = ['contentGraphService']
