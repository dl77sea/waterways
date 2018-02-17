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
ContentGraph.$inject = ['contentGraphService', '$state', '$stateParams', 'commonService', '$scope']

function ContentGraph(contentGraphService, $state, $stateParams, commonService, $scope) {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("content graph init")
    ctrl.prob = "-"
    ctrl.firstFailYear = contentGraphService.firstFailYear
    commonService.setLatLngHeader($stateParams.lat, $stateParams.lng)

    //&startYear&endYear&threshold&designLifetime&bfwDesign
    if ($stateParams.currentBfw === undefined) {
      ctrl.currentBfw = commonService.defaultCurrentBfw
    } else {
      ctrl.currentBfw = $stateParams.currentBfw
    }
    if ($stateParams.bfwDesign === undefined) {
      ctrl.bfwDesign = commonService.defaultBfwDesign
    } else {
      ctrl.bfwDesign = $stateParams.bfwDesign
    }
    if ($stateParams.designLifetime === undefined) {
      ctrl.designLifetime = commonService.defaultDesignLifetime
    } else {
      ctrl.designLifetime = $stateParams.designLifetime
    }

    ctrl.lat = $stateParams.lat
    ctrl.lng = $stateParams.lng

    ctrl.updateGraphsOnInit()



  }
  // $state.go('common-top.content-graph', {
  //   lat: 123,
  //   lng: 345,
  //   startYear: ctrl.startYear,
  //   endYear: ctrl.endYear,
  //   currentBfw: ctrl.currentBfw,
  //   designLifetime: ctrl.designLifetime,
  //   bfwDesign: ctrl.bfwDesign
  // })



  ctrl.updateGraphsOnInit = function() {
    console.log("hello from ctrl.updateGraphsOnInit")    
    contentGraphService.initRatiosGraph(ctrl.lat, ctrl.lng, ctrl.currentBfw, ctrl.designLifetime, ctrl.bfwDesign)
    contentGraphService.updateRatiosGraph(() => {
      contentGraphService.updateProbabilityGraph(() => {
        ctrl.prob = contentGraphService.prob
        ctrl.firstFailYear = contentGraphService.firstFailYear
        console.log("all done")
        $scope.$apply()
      })
    })
  }


  ctrl.updateGraphs = function() {
    console.log("hello from ctrl.updateGraphs")

    contentGraphService.updateRatiosGraph(() => {
      contentGraphService.updateProbabilityGraph(() => {
        ctrl.prob = contentGraphService.prob
        ctrl.firstFailYear = contentGraphService.firstFailYear
        console.log("all done")

        $state.go('common-top.content-graph', {
          lat: ctrl.lat,
          lng: ctrl.lng,
          currentBfw: ctrl.currentBfw,
          designLifetime: ctrl.designLifetime,
          bfwDesign: ctrl.bfwDesign
        }, {
          reload: false
          // notify: false
        })

        $scope.$apply()
      })
    })


    // contentGraphService.updateRatiosGraph()
    // contentGraphService.updateProbabilityGraph()


  }
}
