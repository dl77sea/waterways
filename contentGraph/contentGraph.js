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
    ctrl.prob = '-'
    commonService.setLatLngHeader($stateParams.lat, $stateParams.lng)
    //&startYear&endYear&threshold&designLifetime&bfwDesign
    if ($stateParams.startYear === undefined) {
      ctrl.startYear = commonService.defaultStartYear
    } else {
      ctrl.startYear = $stateParams.startYear
    }
    if ($stateParams.endYear === undefined) {
      ctrl.endYear = commonService.defaultEndYear
    } else {
      ctrl.endYear = $stateParams.endYear
    }
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
    // ctrl.setGraphVals()
    // const a = new Promise(function(resolve, reject) {
      contentGraphService.initRatiosGraph(ctrl.lat, ctrl.lng, ctrl.startYear, ctrl.endYear, ctrl.currentBfw, ctrl.designLifetime, ctrl.bfwDesign)
      contentGraphService.updateRatiosGraph(()=>{
        contentGraphService.updateProbabilityGraph(()=>{
          // resolve()
          console.log(contentGraphService.prob);
          ctrl.prob = contentGraphService.prob
          console.log("all done")
          $scope.$apply()
        })
      })
    // })

    // a.then(function() {
    //   // ctrl.prob = contentGraphService.pro
    //   console.log("all done")
    // })


    //$scope.apply()


  }


  ctrl.updateGraphs = function() {
    console.log("hello from ctrl.updateGraphs")

    contentGraphService.updateRatiosGraph()
    contentGraphService.updateProbabilityGraph()

    $state.go('common-top.content-graph', {
      lat: ctrl.lat,
      lng: ctrl.lng,
      startYear: ctrl.startYear,
      endYear: ctrl.endYear,
      currentBfw: ctrl.currentBfw,
      designLifetime: ctrl.designLifetime,
      bfwDesign: ctrl.bfwDesign
    }, {
      reload: false
      // notify: false
    })

  }
}
