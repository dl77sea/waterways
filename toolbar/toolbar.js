function Toolbar(contentGraphService) {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("toolbar init")

    ctrl.getStartEndDates(ctrl.continueInit)
    //from common
    // ctrl.threshold = 1.0
  }

}

angular.module('app').component('toolbar', {
  templateUrl: './toolbar/toolbar.html',
  controller: Toolbar,
  bindings: {
    lattt: '=',
    editMode: '=',
    coords: '=',
    getStartEndDates: '&',
    startYear: '=',
    endYear: '='
  }
})

Toolbar.$inject = ['contentGraphService']
