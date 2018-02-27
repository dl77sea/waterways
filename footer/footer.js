function Footer(commonService, $scope) {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("footer init")
    ctrl.editMode = commonService.editMode
    ctrl.csvFile = "./testcsv/" + ctrl.coords.lat + ctrl.coords.lng + "/" + ctrl.coords.lat + ctrl.coords.lng + "ratio.csv"
    ctrl.csvFileName = "./testcsv/" + ctrl.coords.lat + ctrl.coords.lng + "/"
    ctrl.csvFilePath = ctrl.coords.lat + ctrl.coords.lng + "ratio.csv"
  }

  ctrl.download = function() {
    console.log("download: ctrl.coords: ", ctrl.csvFile)
    window.location.assign(ctrl.csvFile);
    // ctrl.csvFile = "./testcsv/" + ctrl.coords.lat+ctrl.coords.lng + "/" + ctrl.coords.lat+ctrl.coords.lng + "ratio.csv"
  }
}


angular.module('app').component('footer', {
  templateUrl: './footer/footer.html',
  controller: Footer,
  bindings: {
    // editMode: '=',
    coords: '='
  }
})

Footer.$inject = ['commonService', '$scope']
