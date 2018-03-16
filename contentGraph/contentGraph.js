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
  .directive('stringToNumber', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          return '' + value;
        });
        ngModel.$formatters.push(function(value) {
          return parseFloat(value);
        });
      }
    };
  });

ContentGraph.$inject = ['contentGraphService', '$state', '$stateParams', 'commonService', '$scope']

function ContentGraph(contentGraphService, $state, $stateParams, commonService, $scope) {
  var ctrl = this

  ctrl.$onInit = function() {
    ctrl.prob = "-"
    ctrl.avgFirstFailYear = contentGraphService.avgFirstFailYear
    commonService.editMode.mode = "graph"
    commonService.setLatLngHeader($stateParams.lat, $stateParams.lng)

    //create an instance of the map tile in commonService so exists when user hits back when deep linked
    if (commonService.selectedTile === null) {
      commonService.tileFromGraph = {
        lat: parseFloat($stateParams.lat),
        lng: parseFloat($stateParams.lng)
      };
    } else {
      //clear from service so it's not re-used
      commonService.tileFromGraph = null;
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

    ctrl.designLifetimeMax = commonService.designLifetimeMax
    ctrl.designLifetimeMin = 0

    ctrl.updateGraphsOnInit()

    ctrl.sizePerCode = Number.parseFloat(1.2 * ctrl.currentBfw + 2).toFixed(2)
  }

  ctrl.updateGraphsOnInit = function() {
    contentGraphService.initRatiosGraph(ctrl.lat, ctrl.lng)
    contentGraphService.updateRatiosGraph(ctrl.currentBfw, ctrl.designLifetime, ctrl.bfwDesign, () => {
      contentGraphService.updateProbabilityGraph(() => {
//        ctrl.prob = Number.parseFloat(contentGraphService.prob).toFixed(0)
        ctrl.prob = contentGraphService.prob
        ctrl.avgFirstFailYear = contentGraphService.avgFirstFailYear
        ctrl.nModels = contentGraphService.nModels
        $scope.$apply()
      })
    })
  }

  ctrl.cb = function() {
//    ctrl.prob = Number.parseFloat(contentGraphService.prob).toFixed(0)
    ctrl.prob = contentGraphService.prob
    ctrl.avgFirstFailYear = contentGraphService.avgFirstFailYear
    $state.go('common-top.content-graph', {
        lat: ctrl.lat,
        lng: ctrl.lng,
        currentBfw: ctrl.currentBfw,
        designLifetime: ctrl.designLifetime,
        bfwDesign: ctrl.bfwDesign
      }, {
        reloadOnSearch: false
        // reload: false,
        // notify: false
      })
    }

    ctrl.updateRatiosGraphCb = function() {
      contentGraphService.updateProbabilityGraph(ctrl.cb)
    }

    ctrl.updateGraphs = function() {
      contentGraphService.updateRatiosGraph(ctrl.currentBfw, ctrl.designLifetime, ctrl.bfwDesign, ctrl.updateRatiosGraphCb)
    }
  }
