angular.module('app').service('commonService', commonService)


//single source of truth for form defaults
//and place to store selected tile lat and lng
//so that on loading graph from deep link query params,
//map component will know which tile to highlight when user goes back to map
function commonService() {
  var vm = this

  // vm.currentYear = (new Date()).getFullYear()
  vm.selectedTile=null
  vm.startYear = 2014
  vm.endYear = 2090
  vm.defaultCurrentBfw = 30
  vm.defaultBfwDesign = 32
  vm.defaultDesignLifetime = 50

  vm.setLatLngHeader = function(cenLat, cenLng) {
    document.getElementById('coord-display').innerHTML = vm.startYear + "&nbsp;-&nbsp;"+vm.endYear + "&nbsp;&nbsp;LAT " + cenLat + ",&nbsp;&nbsp;" + "LNG&nbsp;&nbsp;" + cenLng
  }


}
