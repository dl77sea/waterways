(function() {
  'use strict';



angular.module('app').component('contentMap', {
  templateUrl: './contentMap/contentMap.html',
  controller: ContentMap
  // bindings: {
  //   lattt: '=',
  //   coords: '=',
  //   editMode: '=',
  //   genGraph: '&'
  // }
})

// Toolbar.$inject = ['serviceSvg','serviceCase', 'servicePartition']
// function Toolbar(serviceSvg, serviceCase, servicePartition) {
ContentMap.$inject = ['$scope', 'contentGraphService', '$state', '$stateParams']

function ContentMap($scope, contentGraphService, $state, $stateParams) {
  var ctrl = this
  ctrl.startYear = 2014
  ctrl.endYear = 2090
  ctrl.defaultLat = 48.71875
  ctrl.defaultLng = -122.09375
  ctrl.coords = {lat: ctrl.defaultLat, lng: ctrl.defaultLng}


  ctrl.gridInc = 0.0625 / 2

  ctrl.$onInit = function() {

    let map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: ctrl.coords.lat,
        lng: ctrl.coords.lng
      },
      zoom: 11,
      styles:
      [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dadada"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c9c9c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#00e5ff"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        }
      ]

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

        tileOpts = {
          strokeColor: ctrl.colorUnsel,
          strokeOpacity: 1.0,
          strokeWeight: 1.0,
          fillColor: '#FFFFFF',
          fillOpacity: 0.0,
          zIndex: -1,
          map: map,
          bounds: square
        }
        tile = new google.maps.Rectangle(tileOpts);

        tile.addListener('click', ctrl.cbGrid);

        tile.addListener('mouseover', function(event) {
          let thisTileCen = this.getBounds().getCenter()
          this.setOptions({
            strokeColor: ctrl.colorOver,
            zIndex: 100,
            strokeOpacity: 1.0,
            strokeWeight: 2.0
          })
           ctrl.setLatLngHeader(thisTileCen.lat(), thisTileCen.lng())
        })


        tile.addListener('mousedown', function(event) {
          this.setOptions({
            strokeColor: ctrl.colorSel,
            zIndex: 99999,
            strokeWeight: 4.0
          })
        })

        tile.addListener('mouseout', function(event) {
          console.log(this)
          this.setOptions({
            strokeColor: ctrl.colorUnsel,
            zIndex: 1,
            strokeWeight: 1.0
          })

        })

      } //end for each tile
    }

  }

  ctrl.cbGrid = function(event) {
    //format long value (ok for WA)
    let formattedLng = -ctrl.defaultLng
    console.log("formattedLng",formattedLng)
    //&startYear&endYear&threshold&designLifetime&bfwDesign

    // todo: figure out how to get default values from bindings or passed object (whichever better)
    //?lat&lng&startYear&endYear&currentBfw&designLifetime&bfwDesign',
    $state.go('common-top.content-graph', {
      lat: 123,
      lng: formattedLng,
      // startYear: 2014,
      // endYear: 2090,
      // currentBfw: 32,
      // designLifetime: 2060,
      // bfwDesign: 30
      // notify: false
      // reloadOnSearch: false
    })
    // {reload: false})
  }

  ctrl.setLatLngHeader = function(cenLat, cenLng) {
    ctrl.coords.lat = cenLat
    ctrl.coords.lng = cenLng
    document.getElementById('coord-display').innerHTML = ctrl.startYear + "&nbsp;-&nbsp;"+ctrl.endYear + "&nbsp;&nbsp;LAT " + ctrl.coords.lat + ",&nbsp;&nbsp;" + "LNG&nbsp;&nbsp;" + ctrl.coords.lng
  }


}

}());
