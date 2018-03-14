angular.module('app').service('commonService', commonService)

function commonService() {
  var vm = this
  vm.selectedTile = null
  vm.tileFromGraph = null;
  vm.defaultCurrentBfw = 8
  vm.defaultBfwDesign = 12
  vm.defaultDesignLifetime = 50
  vm.currentYear = (new Date()).getFullYear()
  vm.startYear = null
  vm.endYear = null
  vm.editMode = {
    mode: "map"
  }

  vm.setLatLngHeader = function(cenLat, cenLng) {
    document.getElementById('coord-display').innerHTML = "&nbsp;&nbsp;LAT " + cenLat + ",&nbsp;&nbsp;" + "LONG&nbsp;&nbsp;" + cenLng
  }

  vm.getStartEndDates = function() {
    vm.startYear = (new Date()).getFullYear()
    vm.endYear = 2099
    vm.designLifetimeMax = vm.endYear - vm.startYear
  }

  vm.mapExist = false;
}
