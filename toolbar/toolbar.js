function Toolbar(contentGraphService) {
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
    lattt: '=',
    editMode: '=',
    coords: '=',
    genGraph: '&',
    startYear: '=',
    endYear: '='
  }
})

Toolbar.$inject = ['contentGraphService']
