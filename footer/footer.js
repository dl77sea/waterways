function Footer(commonService, $scope, $stateParams) {
  var ctrl = this

  ctrl.$onInit = function() {
    ctrl.editMode = commonService.editMode

    ctrl.csvFile = "./csv/" + ctrl.coords.lat + ctrl.coords.lng + "/" + ctrl.coords.lat + ctrl.coords.lng + "ratio.csv"
    ctrl.csvFileName = "./csv/" + ctrl.coords.lat + ctrl.coords.lng + "/"
    ctrl.csvFilePath = ctrl.coords.lat + ctrl.coords.lng + "ratio.csv"
  }

  ctrl.download = function() {
    ctrl.csvFile = "./csv/" + $stateParams.lat + $stateParams.lng + "/" + $stateParams.lat + $stateParams.lng + "ratio.csv"
    window.location.assign(ctrl.csvFile);
  }
}


angular.module('app').component('footer', {
  templateUrl: './footer/footer.html',
  controller: Footer,
  bindings: {
    coords: '='
  }
})

Footer.$inject = ['commonService', '$scope', '$stateParams']
