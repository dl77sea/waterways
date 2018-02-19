function Toolbar(contentGraphService, commonService) {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("toolbar init")


    //from common
    // ctrl.threshold = 1.0
  }

}

angular.module('app').component('toolbar', {
  templateUrl: './toolbar/toolbar.html',
  controller: Toolbar,
  bindings: {
    // lattt: '=',
    // editMode: '=',
    // coords: '=',
    // getStartEndDates: '&',
    // continueInit: '&',
    startYear: '=',
    endYear: '='
  }
})

Toolbar.$inject = ['contentGraphService', 'commonService']
