angular.module('app').component('contentMap', {
  templateUrl: './contentMap/contentMap.html',
  controller: ContentMap,
  bindings: {
    lattt: '=',
    coords: '=',
    editMode: '=',
    genGraph: '&'
  }
})

// Toolbar.$inject = ['serviceSvg','serviceCase', 'servicePartition']
// function Toolbar(serviceSvg, serviceCase, servicePartition) {
ContentMap.$inject = ['$scope','contentGraphService']

function ContentMap($scope, contentGraphService) {
  var ctrl = this

  ctrl.strYearRange = "2014-2090 "

  ctrl.gridInc = 0.0625 / 2

  ctrl.$onInit = function() {
    console.log("content map init")

    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: ctrl.coords.lat,
        lng: ctrl.coords.lng
      },
      zoom: 11
    });

    let gridX = 18
    let gridY = 18
    let gridInc = ctrl.gridInc
    let latStartCen = 48.71875 + (9 * (ctrl.gridInc * 2))
    let lonStartCen = -122.09375 - (9 * (ctrl.gridInc * 2))

    let tileOpts;
    let tile;

    ctrl.colorUnsel = "#A0A0A0"
    ctrl.colorSel = "#00FFFF"
    ctrl.colorDown = "#00FFFF"
    ctrl.colorOver = "#FFF"

    //row
    for (let i = 0; i < gridY; i++) {
      //square
      for (let j = 0; j < gridX; j++) {
        //lon decreases to east
        //lat decreases to south

        // let swCornerLat = latStartCen - gridInc
        // let swCornerLng = lonStartCen - gridInc
        // let neCornerLat = latStartCen + gridInc
        // let neCornerLng = lonStartCen + gridInc

        //this block produces a correct grid square
        // let swCornerLat = (latStartCen - gridInc) + (i*(gridInc*2))
        // let swCornerLng = (lonStartCen - gridInc) + (j*(gridInc*2))
        // let neCornerLat = (latStartCen + gridInc) + (i*(gridInc*2))
        // let neCornerLng = (lonStartCen + gridInc) + (j*(gridInc*2))
        //
        // let swCorner = {lat: swCornerLat, lng: swCornerLng}
        // let neCorner = {lat: neCornerLat, lng: neCornerLng}

        let swCornerLat = (latStartCen - gridInc) - (i * (gridInc * 2))
        let swCornerLng = (lonStartCen - gridInc) + (j * (gridInc * 2))

        let neCornerLat = (latStartCen + gridInc) - (i * (gridInc * 2))
        let neCornerLng = (lonStartCen + gridInc) + (j * (gridInc * 2))

        let swCorner = {
          lat: swCornerLat,
          lng: swCornerLng
        }
        let neCorner = {
          lat: neCornerLat,
          lng: neCornerLng
        }

        let square = new google.maps.LatLngBounds(swCorner, neCorner)

        let cenLat = square.getCenter().lat()
        let cenLng = square.getCenter().lng()

        // if ((cenLat === 48.71875) && (cenLng === (-122.09375))) {
        //   console.log("FOUND")
        //
        //   tileOpts = {
        //     strokeColor: ctrl.colorSel,
        //     // jointType: BEVEL,
        //     strokeOpacity: 1.0,
        //     strokeWeight: 4.0,
        //     fillColor: '#FFFFFF',
        //     fillOpacity: 0.0,
        //     map: map,
        //     bounds: square
        //   }
        //   tile = new google.maps.Rectangle(tileOpts);
        //   ctrl.selectedTile = tile
        //   // ctrl.setLatLngHeader(cenLat, cenLng)
        //
        // } else {
          tileOpts = {
            strokeColor: ctrl.colorUnsel,
            // jointType: BEVEL,
            strokeOpacity: 1.0,
            strokeWeight: 1.0,
            fillColor: '#FFFFFF',
            fillOpacity: 0.0,
            zIndex: -1,
            map: map,
            bounds: square
          }
          tile = new google.maps.Rectangle(tileOpts);
        // }


        tile.addListener('click', ctrl.cbGrid);

        tile.addListener('mouseover', function(event) {
          let thisTileCen = this.getBounds().getCenter()
          // if (
          //   (thisTileCen.lat() !== ctrl.selectedTile.getBounds().getCenter().lat()) ||
          //   (thisTileCen.lng() !== ctrl.selectedTile.getBounds().getCenter().lng())
          // ) {
          //
            this.setOptions({
              strokeColor: ctrl.colorOver,
              zIndex: 100,
              strokeOpacity: 1.0,
              strokeWeight: 2.0
            })
            ctrl.setLatLngHeader(thisTileCen.lat(), thisTileCen.lng())
          // }
        })

        // tile.addListener('mouseout', function(event) {
        //   let thisTileCen = this.getBounds().getCenter()
        //
        //   console.log("--------")
        //   console.log("thisTileCen.lat() ", thisTileCen.lat())
        //   console.log("thisTileCen.lng() ", thisTileCen.lng())
        //   console.log("ctrl.selectedTile.getBounds().getCenter().lat() ", ctrl.selectedTile.getBounds().getCenter().lat())
        //   console.log("ctrl.selectedTile.getBounds().getCenter().lng() ", ctrl.selectedTile.getBounds().getCenter().lng())
        //   console.log("eval ", (
        //     //   (thisTileCen.lat() !== ctrl.selectedTile.getBounds().getCenter().lat()) &&
        //     //   (thisTileCen.lng() !== ctrl.selectedTile.getBounds().getCenter().lng())
        //     (thisTileCen.lat() !== ctrl.selectedTile.getBounds().getCenter().lat()) &&
        //     (thisTileCen.lng() !== ctrl.selectedTile.getBounds().getCenter().lng())
        //   ))
        //   console.log('eval ', (thisTileCen.lat() !== ctrl.selectedTile.getBounds().getCenter().lat()))
        //   console.log("--------")
        //
        //
        //   if (
        //     (thisTileCen.lat() !== ctrl.selectedTile.getBounds().getCenter().lat()) ||
        //     (thisTileCen.lng() !== ctrl.selectedTile.getBounds().getCenter().lng())
        //   ) {
        //     console.log('happening')
        //     this.setOptions({
        //       strokeColor: ctrl.colorUnsel,
        //       zIndex: -1,
        //       strokeWeight: 1.0
        //     })
        //   }
        // })


        tile.addListener('mousedown', function(event) {
          this.setOptions({
            strokeColor: ctrl.colorSel,
            zIndex: 99999,
            strokeWeight: 4.0
          })
        })

        // tile.addListener('mouseup', function(event) {
        //   let thisTileCen = this.getBounds().getCenter()
        //   if (
        //     (thisTileCen.lat() !== ctrl.selectedTile.getBounds().getCenter().lat()) ||
        //     (thisTileCen.lng() !== ctrl.selectedTile.getBounds().getCenter().lng())
        //   ) {
        //     this.setOptions({
        //       strokeColor: ctrl.colorUnsel,
        //       zIndex: -1,
        //       strokeWeight: 1.0
        //     })
        //   }
        // })

        tile.addListener('mouseout', function(event) {
          // let thisSelectedTile = this.getBounds().getCenter()
          console.log(this)
          this.setOptions({
            strokeColor: ctrl.colorUnsel,
            zIndex: 1,
            strokeWeight: 1.0
          })
          // if (
          //   (thisSelectedTile.lat() === ctrl.selectedTile.getBounds().getCenter().lat()) &&
          //   (thisSelectedTile.lng() === ctrl.selectedTile.getBounds().getCenter().lng())
          // ) {
          //   this.setOptions({
          //     strokeColor: ctrl.colorSel,
          //     zIndex: 9999,
          //     strokeWeight: 4.0
          //   })
          // }
        })

      }//end for each tile
    }
    // console.log ()
    // ctrl.setLatLngHeader(48.71875, -122.09375)
  }

  ctrl.cbGrid = function(event) {
    console.log("callback happened", ctrl.editMode)

    // ctrl.editMode.mode = "graph"
    ctrl.genGraph()
    $scope.$apply()
    console.log("callback happened", ctrl.editMode)
  }
  ctrl.setLatLngHeader = function(cenLat, cenLng) {
    ctrl.coords.lat = cenLat
    ctrl.coords.lng = cenLng

    // degree symbol º
    document.getElementById('coord-display').innerHTML = "LAT "+ ctrl.coords.lat + ", " + "LNG " + ctrl.coords.lng
  }
}
