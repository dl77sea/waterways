angular.module('app').service('commonService', commonService)


//single source of truth for form defaults
//and place to store selected tile lat and lng
//so that on loading graph from deep link query params,
//map component will know which tile to highlight when user goes back to map
function commonService() {
  var vm = this

  // vm.currentYear = (new Date()).getFullYear()
  vm.selectedTile = null

  vm.defaultCurrentBfw = 30
  vm.defaultBfwDesign = 32
  vm.defaultDesignLifetime = 50

  //set from common.js
  vm.startYear = null
  vm.endYear = null

  vm.setLatLngHeader = function(cenLat, cenLng) {
    document.getElementById('coord-display').innerHTML = "&nbsp;&nbsp;LAT " + cenLat + ",&nbsp;&nbsp;" + "LNG&nbsp;&nbsp;" + cenLng
  }
}
