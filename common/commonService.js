angular.module('app').service('commonService', commonService)


//single source of truth for form defaults
//and place to store selected tile lat and lng
//so that on loading graph from deep link query params,
//map component will know which tile to highlight when user goes back to map
function commonService() {
  var vm = this

  // vm.currentYear = (new Date()).getFullYear()
  vm.selectedTile = null

  // vm.buildSelectedTile = false;
  vm.tileFromGraph = null;

  vm.defaultCurrentBfw = 8
  vm.defaultBfwDesign = 12
  vm.defaultDesignLifetime = 50

  vm.currentYear = (new Date()).getFullYear()

  //set from common.js
  vm.startYear = null
  vm.endYear = null

  vm.editMode = {
    mode: "map"
  }

  vm.setLatLngHeader = function(cenLat, cenLng) {
    document.getElementById('coord-display').innerHTML = "&nbsp;&nbsp;LAT " + cenLat + ",&nbsp;&nbsp;" + "LNG&nbsp;&nbsp;" + cenLng
  }

  vm.getStartEndDates = function(cb) {
    d3.csv("./testcsv/A1B45.65625-120.96875ratio.csv", function(error, data) {
      if (error) throw error;
      let keys = Object.keys(data[0])
      // ctrl.startYear = parseInt(keys[0])            //2014
      // ctrl.endYear = parseInt(keys[keys.length-2])  //2090

      vm.startYear = parseInt(keys[0])            //2014
      vm.endYear = parseInt(keys[keys.length-2])  //2090

      console.log("start and end year from commonService: ", vm.startYear, vm.endYear)
      vm.designLifetimeMax = vm.endYear - (new Date()).getFullYear()
      console.log(vm.designLifetimeMax)
      cb()
    })
  }

  // vm.getDesignEndYear = function(designLifetime) {
  //   let designEndYear = (new Date()).getFullYear() + parseInt(designLifetime)
  //   return designEndYear
  // }


}
