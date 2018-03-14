angular.module('app').service('contentMapService', contentMapService)
contentMapService.$inject = ['$state', 'commonService']

function contentMapService($state, commonService) {
  console.log("top")
  var vm = this


  vm.defaultLat = 47.34375
  vm.defaultLng = -120.78125
  vm.coords = {
    lat: vm.defaultLat,
    lng: vm.defaultLng
  }

  vm.gridInc = 0.0625 / 2

  vm.gridArray = []

  vm.map = null

  vm.initMap = function() {
    console.log("contentMapService init")
    // commonService.editMode.mode = "map"
    vm.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: vm.coords.lat,
        lng: vm.coords.lng
      },
      zoom: 7,
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
    // google.maps.event.addListenerOnce(map, 'idle', function(){
    //     // do something only the first time the map is loaded
    // });
    google.maps.event.addListenerOnce(vm.map, 'idle', function(){
      console.log("map up")
        vm.buildGrid()
    });


    }

    vm.buildGrid = function() {
      // ---are we comming from a deep linked graph?
      if (commonService.tileFromGraph !== null) {
        console.log("coming from graph")

        let latStartCen = commonService.tileFromGraph.lat
        let lonStartCen = commonService.tileFromGraph.lng

        let swCornerLat = (latStartCen - vm.gridInc)
        let swCornerLng = (lonStartCen - vm.gridInc)

        let neCornerLat = (latStartCen + vm.gridInc)
        let neCornerLng = (lonStartCen + vm.gridInc)

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
          strokeColor: vm.colorUnsel,
          strokeOpacity: 1.0,
          strokeWeight: 1.0,
          fillColor: '#FFFFFF',
          fillOpacity: 0.0,
          zIndex: -1,
          map: vm.map,
          bounds: square
        }

        // let cenLat = square.getCenter().lat()
        // let cenLng = square.getCenter().lng()
        let tile = new google.maps.Rectangle(tileOpts);

        commonService.selectedTile = tile
      }

      //if comming back from graph page
      if (commonService.selectedTile !== null) {
        console.log("coming from graph selectTile exist")
        vm.map.panTo({
          lat: commonService.selectedTile.getBounds().getCenter().lat(),
          lng: commonService.selectedTile.getBounds().getCenter().lng()
        });
        // map.setZoom(10);
      }

      //---begin populating grid squares from regions csv---
      console.log("check")
      let gridX = 18
      let gridY = 18
      let gridInc = vm.gridInc
      let latStartCen = 48.71875 + (9 * (vm.gridInc * 2))
      let lonStartCen = -122.09375 - (9 * (vm.gridInc * 2))

      let tileOpts;
      let tile;

      vm.colorUnsel = "#A0A0A0"
      vm.colorSel = "#0097a7"
      vm.colorDown = "#00FFFF"
      vm.colorOver = "#FFF"

      let data;

      if (commonService.mapExist === false) {
        // read in tiles center locations from csv
        console.log("csv data from file")
        d3.csv("./VIC_Castro_Regions.csv", function(error, dataFromCsv) {
          data = dataFromCsv;
          if (error) throw error;

          vm.gridArray = data;

          vm.processCsvData(data)
        })
      } else {
        console.log("csv data from array")
        let data = vm.gridArray;
        vm.processCsvData(data)
      }
      vm.processCsvData = function(data) {
        console.log("here is the data: ", data)
        //build grid square tiles from csv regions data
        for (let obj of data) {
          let latStartCen = parseFloat(obj.lat)
          let lonStartCen = parseFloat(obj.lng)
          let swCornerLat = (latStartCen - vm.gridInc)
          let swCornerLng = (lonStartCen - vm.gridInc)

          let neCornerLat = (latStartCen + vm.gridInc)
          let neCornerLng = (lonStartCen + vm.gridInc)

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
            strokeColor: vm.colorUnsel,
            strokeOpacity: 1.0,
            strokeWeight: 1.0,
            fillColor: '#FFFFFF',
            fillOpacity: 0.0,
            zIndex: -1,
            map: vm.map,
            bounds: square
          }

          //do all this so that correct tile is highlighted when user switched back to map from graph
          if (commonService.selectedTile !== null) {
            if (
              commonService.selectedTile.getBounds().getCenter().lat() !== cenLat ||
              commonService.selectedTile.getBounds().getCenter().lng() !== cenLng
            ) {
              tileOpts.strokeColor = vm.colorUnsel
              tile = new google.maps.Rectangle(tileOpts);
            } else {
              tileOpts.strokeColor = vm.colorSel,
                tileOpts.zIndex = 99999,
                tileOpts.strokeWeight = 4.0

              //replace existing commonService.selectedTile with reference to newly generated equivelant
              tile = new google.maps.Rectangle(tileOpts);
              commonService.selectedTile = tile
            }
          } else {
            tileOpts.strokeColor = vm.colorUnsel
            tile = new google.maps.Rectangle(tileOpts);
          }

          //assign event handlers to new tile
          vm.addDown(tile)
          vm.addClick(tile)
          vm.addOver(tile)
          vm.addUp(tile)
        }
        commonService.mapExist = true
    }
  }

  vm.addClick = function(tile) {
    tile.addListener('click',
      function(event) {
        // clear previous selected
        if (commonService.selectedTile !== null) {
          commonService.selectedTile.setOptions({
            strokeColor: vm.colorUnsel
          })
        }
        // set this selected tile
        commonService.selectedTile = this
        vm.selectedLat = this.getBounds().getCenter().lat()
        vm.selectedLat = this.getBounds().getCenter().lng()

        // commonService.editMode.mode = "graph"
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

  vm.addOver = function(tile) {
    tile.addListener('mouseover', function(event) {
      let thisTileCen = this.getBounds().getCenter()

      if (commonService.selectedTile !== null) {
        if (
          thisTileCen.lat() === commonService.selectedTile.getBounds().getCenter().lat() &&
          thisTileCen.lng() === commonService.selectedTile.getBounds().getCenter().lng()
        ) {
          this.setOptions({
            strokeColor: vm.colorSel,
            zIndex: 999999,
            strokeOpacity: 1.0,
            strokeWeight: 4.0
          })
        } else {
          this.setOptions({
            strokeColor: vm.colorOver,
            zIndex: 999999,
            strokeOpacity: 1.0,
            strokeWeight: 2.0
          })
        }
      } else {
        this.setOptions({
          strokeColor: vm.colorOver,
          zIndex: 999999,
          strokeOpacity: 1.0,
          strokeWeight: 2.0
        })
      }
      commonService.setLatLngHeader(thisTileCen.lat(), thisTileCen.lng())
    })
  }

  vm.addDown = function(tile) {
    tile.addListener('mousedown', function(event) {
      let thisTileCen = this.getBounds().getCenter()
      if (commonService.selectedTile !== null) {
        commonService.selectedTile.setOptions({
          strokeColor: vm.colorUnsel,
          zIndex: 999999,
          strokeWeight: 1.0
        })
      } //else {
      console.log("down else")
      this.setOptions({

        strokeColor: vm.colorSel,
        zIndex: 99999,
        strokeWeight: 4.0
      })

    })
  }


  vm.addUp = function(tile) {
    tile.addListener('mouseout', function(event) {
      let thisTileCen = this.getBounds().getCenter()

      if (commonService.selectedTile !== null) {
        if (
          thisTileCen.lat() === commonService.selectedTile.getBounds().getCenter().lat() &&
          thisTileCen.lng() === commonService.selectedTile.getBounds().getCenter().lng()
        ) {
          this.setOptions({
            strokeColor: vm.colorSel,
            zIndex: 9999,
            strokeOpacity: 1.0,
            strokeWeight: 4.0
          })
        } else {
          this.setOptions({
            strokeColor: vm.colorUnsel,
            zIndex: 100,
            strokeOpacity: 1.0,
            strokeWeight: 1.0
          })
        }
      } else {
        this.setOptions({
          strokeColor: vm.colorUnsel,
          zIndex: 100,
          strokeOpacity: 1.0,
          strokeWeight: 1.0
        })
      }
    })
  }
}
