function Toolbar(contentGraphService, commonService) {
  var ctrl = this

  ctrl.$onInit = function() {
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
