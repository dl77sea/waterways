function Footer() {
  var ctrl = this

  ctrl.$onInit = function() {
    console.log("footer init")
  }

  ctrl.clickBackToMap = function() {
    console.log("back to map")

    ctrl.editMode.mode = "map"
  }
}


angular.module('app').component('footer', {
  templateUrl: './footer/footer.html',
  controller: Footer,
  bindings: {
    editMode: '=',
    coords: '='
  }
})

// Footer.$inject = ['contentGraphService']
