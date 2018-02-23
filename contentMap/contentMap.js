(function() {
  'use strict';

  angular.module('app').component('contentMap', {
    templateUrl: './contentMap/contentMap.html',
    controller: ContentMap
    // bindings: {
    // lattt: '=',
    // coords: '=',
    // editMode: '=',
    // genGraph: '&'
    // }
  })

  // Toolbar.$inject = ['serviceSvg','serviceCase', 'servicePartition']
  // function Toolbar(serviceSvg, serviceCase, servicePartition) {
  ContentMap.$inject = ['$scope', 'contentGraphService', '$state', '$stateParams', 'commonService']

  function ContentMap($scope, contentGraphService, $state, $stateParams, commonService) {
    var ctrl = this

    commonService.editMode.mode = "map"

    ctrl.defaultLat = 45.65625
    ctrl.defaultLng = -121.09375
    ctrl.coords = {
      lat: ctrl.defaultLat,
      lng: ctrl.defaultLng
    }

    ctrl.gridInc = 0.0625 / 2

    ctrl.$onInit = function() {
      console.log("map onInit")

      let map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: ctrl.coords.lat,
          lng: ctrl.coords.lng
        },
        zoom: 11,
        styles: [{
            "elementType": "geometry",
            "stylers": [{
              "color": "#f5f5f5"
            }]
          },
          {
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "off"
            }]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#616161"
            }]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{
              "color": "#f5f5f5"
            }]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#bdbdbd"
            }]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
              "color": "#eeeeee"
            }]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#757575"
            }]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{
              "color": "#e5e5e5"
            }]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#9e9e9e"
            }]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{
              "color": "#ffffff"
            }]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#757575"
            }]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{
              "color": "#dadada"
            }]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#616161"
            }]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#9e9e9e"
            }]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{
              "color": "#e5e5e5"
            }]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [{
              "color": "#eeeeee"
            }]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
              "color": "#c9c9c9"
            }]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#00e5ff"
            }]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#9e9e9e"
            }]
          }
        ]

      });


      // ---are we comming from a deep linked graph?
      if (commonService.tileFromGraph !== null) {

        let latStartCen = commonService.tileFromGraph.lat
        let lonStartCen = commonService.tileFromGraph.lng

        let swCornerLat = (latStartCen - ctrl.gridInc)
        let swCornerLng = (lonStartCen - ctrl.gridInc)

        let neCornerLat = (latStartCen + ctrl.gridInc)
        let neCornerLng = (lonStartCen + ctrl.gridInc)

        let swCorner = {
          lat: swCornerLat,
          lng: swCornerLng
        }

        let neCorner = {
          lat: neCornerLat,
          lng: neCornerLng
        }

        let square = new google.maps.LatLngBounds(swCorner, neCorner)

        let tileOpts = {
          strokeColor: ctrl.colorUnsel,
          strokeOpacity: 1.0,
          strokeWeight: 1.0,
          fillColor: '#FFFFFF',
          fillOpacity: 0.0,
          zIndex: -1,
          map: map,
          bounds: square
        }

        // let cenLat = square.getCenter().lat()
        // let cenLng = square.getCenter().lng()
        let tile = new google.maps.Rectangle(tileOpts);

        commonService.selectedTile = tile
      }

      //if comming back from graph page
      if (commonService.selectedTile !== null) {
        map.panTo({
          lat: commonService.selectedTile.getBounds().getCenter().lat(),
          lng: commonService.selectedTile.getBounds().getCenter().lng()
        });
        // map.setZoom(10);
      }

      //---begin populating grid squares from regions csv---
      let gridX = 18
      let gridY = 18
      let gridInc = ctrl.gridInc
      let latStartCen = 48.71875 + (9 * (ctrl.gridInc * 2))
      let lonStartCen = -122.09375 - (9 * (ctrl.gridInc * 2))

      let tileOpts;
      let tile;

      ctrl.colorUnsel = "#A0A0A0"
      ctrl.colorSel = "#0097a7"
      ctrl.colorDown = "#00FFFF"
      ctrl.colorOver = "#FFF"

      // read in tiles center locations from csv
      d3.csv("./Test_Regions.csv", function(error, data) {
        if (error) throw error;
        console.log("Test_Regions.csv: ", data)

        //build grid square tiles from csv regions data
        for (let obj of data) {
          let latStartCen = parseFloat(obj.lat)
          let lonStartCen = parseFloat(obj.lng)
          console.log("latStartCen, lonStartCen: ", latStartCen, lonStartCen)
          let swCornerLat = (latStartCen - ctrl.gridInc)
          let swCornerLng = (lonStartCen - ctrl.gridInc)

          let neCornerLat = (latStartCen + ctrl.gridInc)
          let neCornerLng = (lonStartCen + ctrl.gridInc)

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
          //do all this so that correct tile is highlighted when user switched back to map from graph
          if (commonService.selectedTile !== null) {
            console.log("snarf selectedTile lat and lng: ", commonService.selectedTile.getBounds().getCenter().lat(), commonService.selectedTile.getBounds().getCenter().lng())
            console.log("snarf cenLat and cenLng: ", cenLat, cenLng)
            if (
              commonService.selectedTile.getBounds().getCenter().lat() !== cenLat ||
              commonService.selectedTile.getBounds().getCenter().lng() !== cenLng
            ) {
              console.log("snarf unsel")
              tileOpts.strokeColor = ctrl.colorUnsel
              tile = new google.maps.Rectangle(tileOpts);
            } else {
              console.log("snarf sel")
              tileOpts.strokeColor = ctrl.colorSel,
                tileOpts.zIndex = 99999,
                tileOpts.strokeWeight = 4.0

              //replace existing commonService.selectedTile with reference to newly generated equivelant
              tile = new google.maps.Rectangle(tileOpts);
              commonService.selectedTile = tile
            }
          } else {
            tileOpts.strokeColor = ctrl.colorUnsel
            tile = new google.maps.Rectangle(tileOpts);
          }

          // let tile = new google.maps.Rectangle(tileOpts);

          //assign event handlers to new tile
          ctrl.addDown(tile)
          ctrl.addClick(tile)
          ctrl.addOver(tile)
          ctrl.addUp(tile)
        }



      })





      /*
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

          //do all this so that correct tile is highlighted when user switched back to map from graph
          if (commonService.selectedTile !== null) {
            if (
              commonService.selectedTile.getBounds().getCenter().lat() !== cenLat ||
              commonService.selectedTile.getBounds().getCenter().lng() !== cenLng
            ) {
              tileOpts.strokeColor = ctrl.colorUnsel
              tile = new google.maps.Rectangle(tileOpts);
            } else {
              tileOpts.strokeColor = ctrl.colorSel,
                tileOpts.zIndex = 99999,
                tileOpts.strokeWeight = 4.0

              //replace existing commonService.selectedTile with reference to newly generated equivelant
              tile = new google.maps.Rectangle(tileOpts);
              commonService.selectedTile = tile
            }
          } else {
            tileOpts.strokeColor = ctrl.colorUnsel
            tile = new google.maps.Rectangle(tileOpts);
          }

          // tile = new google.maps.Rectangle(tileOpts);

          tile.addListener('click',

            function(event) {
              // clear previous selected
              if (commonService.selectedTile !== null) {
                commonService.selectedTile.setOptions({
                  strokeColor: ctrl.colorUnsel
                })
              }
              // set this selected tile
              commonService.selectedTile = this
              // commonService.selectedTile.setOptions({
              //   strokeColor: ctrl.colorSel,
              //   zIndex: 99999,
              //   strokeWeight: 4.0
              // })

              ctrl.selectedLat = this.getBounds().getCenter().lat()
              ctrl.selectedLat = this.getBounds().getCenter().lng()


              //format long value (ok for WA)
              let formattedLng = -ctrl.defaultLng
              console.log("formattedLng", formattedLng)

              // map.panTo({lat: commonService.selectedTile.getBounds().getCenter().lat(), lng: commonService.selectedTile.getBounds().getCenter().lng()});
              // map.setZoom(10);

              commonService.editMode.mode = "graph"
              $state.go('common-top.content-graph', {
                lat: commonService.selectedTile.getBounds().getCenter().lat(),
                lng: commonService.selectedTile.getBounds().getCenter().lng(),
                currentBfw: commonService.defaultCurrentBfw,
                designLifetime: commonService.defaultDesignLifetime,
                bfwDesign: commonService.defaultBfwDesign
                // notify: false
                // reloadOnSearch: false
              })

            }



          );

          tile.addListener('mouseover', function(event) {
            let thisTileCen = this.getBounds().getCenter()

            if (commonService.selectedTile !== null) {
              if (
                thisTileCen.lat() === commonService.selectedTile.getBounds().getCenter().lat() &&
                thisTileCen.lng() === commonService.selectedTile.getBounds().getCenter().lng()
              ) {
                console.log("!!!!!!!!!!!!was selected")
                this.setOptions({
                  strokeColor: ctrl.colorSel,
                  zIndex: 999999,
                  strokeOpacity: 1.0,
                  strokeWeight: 4.0
                })
              } else {
                console.log("!!!!!!!!!!!!was not selected: ", commonService.selectedTile.getBounds().getCenter().lat(), thisTileCen.lat())
                this.setOptions({
                  strokeColor: ctrl.colorOver,
                  zIndex: 999999,
                  strokeOpacity: 1.0,
                  strokeWeight: 2.0
                })
              }
            } else {
              console.log("!! else happened")
              this.setOptions({
                strokeColor: ctrl.colorOver,
                zIndex: 999999,
                strokeOpacity: 1.0,
                strokeWeight: 2.0
              })
            }
            commonService.setLatLngHeader(thisTileCen.lat(), thisTileCen.lng())
          })

          tile.addListener('mousedown', function(event) {
            let thisTileCen = this.getBounds().getCenter()

            if (commonService.selectedTile !== null) {
              console.log("selectedTile exists")
              commonService.selectedTile.setOptions({
                strokeColor: ctrl.colorUnsel,
                zIndex: 999999,
                strokeWeight: 1.0
              })
            }
            this.setOptions({
              strokeColor: ctrl.colorSel,
              zIndex: 99999,
              strokeWeight: 4.0
            })

            // if (commonService.selectedTile !== null) {
            //   console.log("mousedown there is a selectedTile")
            //   if (
            //     thisTileCen.lat() === commonService.selectedTile.getBounds().getCenter().lat() &&
            //     thisTileCen.lng() === commonService.selectedTile.getBounds().getCenter().lng()
            //   ) {
            //     console.log("mousedown on selected tile")
            //     commonService.selectedTile.setOptions({
            //       strokeColor: ctrl.colorUnsel,
            //       zIndex: 0,
            //       strokeWeight: 1.0
            //     })
            //     this.setOptions({
            //       strokeColor: ctrl.colorSel,
            //       zIndex: 99999,
            //       strokeWeight: 4.0
            //     })
            //   } else {
            //     console.log("mousedown not on selected tile")
            //     commonService.selectedTile.setOptions({
            //       strokeColor: ctrl.colorUnsel,
            //       zIndex: 0,
            //       strokeWeight: 1.0
            //     })
            //     this.setOptions({
            //       strokeColor: ctrl.colorSel,
            //       zIndex: 99999,
            //       strokeWeight: 4.0
            //     })
            //   }
            // }
          })

          // tile.addListener('mouseup', function(event) {

          tile.addListener('mouseout', function(event) {
            let thisTileCen = this.getBounds().getCenter()

            if (commonService.selectedTile !== null) {
              if (
                thisTileCen.lat() === commonService.selectedTile.getBounds().getCenter().lat() &&
                thisTileCen.lng() === commonService.selectedTile.getBounds().getCenter().lng()
              ) {
                console.log("!!!!!!!!!!!!was selected")
                this.setOptions({
                  strokeColor: ctrl.colorSel,
                  zIndex: 9999,
                  strokeOpacity: 1.0,
                  strokeWeight: 4.0
                })
              } else {
                console.log("!!!!!!!!!!!!was not selected: ", commonService.selectedTile.getBounds().getCenter().lat(), thisTileCen.lat())
                this.setOptions({
                  strokeColor: ctrl.colorUnsel,
                  zIndex: 100,
                  strokeOpacity: 1.0,
                  strokeWeight: 1.0
                })
              }
            } else {
              console.log("!! else happened")
              this.setOptions({
                strokeColor: ctrl.colorUnsel,
                zIndex: 100,
                strokeOpacity: 1.0,
                strokeWeight: 1.0
              })
            }
          })
        } //end for each tile
      }
      */
    }

    ctrl.addClick = function(tile) {
      tile.addListener('click',
        function(event) {
          // clear previous selected
          if (commonService.selectedTile !== null) {
            commonService.selectedTile.setOptions({
              strokeColor: ctrl.colorUnsel
            })
          }
          // set this selected tile
          commonService.selectedTile = this
          ctrl.selectedLat = this.getBounds().getCenter().lat()
          ctrl.selectedLat = this.getBounds().getCenter().lng()

          //format long value (ok for WA)
          // let formattedLng = -ctrl.defaultLng
          // console.log("formattedLng", formattedLng)
          commonService.editMode.mode = "graph"
          $state.go('common-top.content-graph', {
            lat: commonService.selectedTile.getBounds().getCenter().lat(),
            lng: commonService.selectedTile.getBounds().getCenter().lng(),
            currentBfw: commonService.defaultCurrentBfw,
            designLifetime: commonService.defaultDesignLifetime,
            bfwDesign: commonService.defaultBfwDesign
          })
        }
      );
    }

    ctrl.addOver = function(tile) {
      tile.addListener('mouseover', function(event) {
        let thisTileCen = this.getBounds().getCenter()

        if (commonService.selectedTile !== null) {
          if (
            thisTileCen.lat() === commonService.selectedTile.getBounds().getCenter().lat() &&
            thisTileCen.lng() === commonService.selectedTile.getBounds().getCenter().lng()
          ) {
            this.setOptions({
              strokeColor: ctrl.colorSel,
              zIndex: 999999,
              strokeOpacity: 1.0,
              strokeWeight: 4.0
            })
          } else {
            this.setOptions({
              strokeColor: ctrl.colorOver,
              zIndex: 999999,
              strokeOpacity: 1.0,
              strokeWeight: 2.0
            })
          }
        } else {
          this.setOptions({
            strokeColor: ctrl.colorOver,
            zIndex: 999999,
            strokeOpacity: 1.0,
            strokeWeight: 2.0
          })
        }
        commonService.setLatLngHeader(thisTileCen.lat(), thisTileCen.lng())
      })
    }

    ctrl.addDown = function(tile) {
      tile.addListener('mousedown', function(event) {
        let thisTileCen = this.getBounds().getCenter()
        console.log("down enter")
        if (commonService.selectedTile !== null) {
          console.log("down if")
          commonService.selectedTile.setOptions({
            strokeColor: ctrl.colorUnsel,
            zIndex: 999999,
            strokeWeight: 1.0
          })
        } //else {
          console.log("down else")
          this.setOptions({

            strokeColor: ctrl.colorSel,
            zIndex: 99999,
            strokeWeight: 4.0
          })
        // }
      })
    }

    ctrl.addUp = function(tile) {
      tile.addListener('mouseout', function(event) {
        let thisTileCen = this.getBounds().getCenter()

        if (commonService.selectedTile !== null) {
          if (
            thisTileCen.lat() === commonService.selectedTile.getBounds().getCenter().lat() &&
            thisTileCen.lng() === commonService.selectedTile.getBounds().getCenter().lng()
          ) {
            this.setOptions({
              strokeColor: ctrl.colorSel,
              zIndex: 9999,
              strokeOpacity: 1.0,
              strokeWeight: 4.0
            })
          } else {
            this.setOptions({
              strokeColor: ctrl.colorUnsel,
              zIndex: 100,
              strokeOpacity: 1.0,
              strokeWeight: 1.0
            })
          }
        } else {
          this.setOptions({
            strokeColor: ctrl.colorUnsel,
            zIndex: 100,
            strokeOpacity: 1.0,
            strokeWeight: 1.0
          })
        }
      })
    }

  }

}());
