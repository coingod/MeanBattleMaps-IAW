angular.module('meanBattleMaps').component('myMap', {
    templateUrl:'../my-map.component.html',
    controller: mapController
  });

//mapController.$inject = ['NgMap'];

function mapController($scope, NgMap){
    var ctrl = this;
    NgMap.getMap().then(function (map) {
        ctrl.map = map;
    });

    ctrl.markers = [
        {id: 1, lat: 56.951, lng: 24.10, count: 2},
        {id: 2, lat: 56.931, lng: 24.00, count: 2},
        {id: 3, lat: 56.947, lng: 24.14, count: 3},
        {id: 4, lat: 56.924, lng: 24.09, count: 2},
        {id: 5, lat: 56.936, lng: 24.12, count: 2},
        {id: 6, lat: 56.955, lng: 24.10, count: 4},
    ];

    ctrl.germany = new google.maps.LatLng(51.0852265, 5.968913);
    ctrl.england = new google.maps.LatLng(52.7613184, -6.8044202);
    ctrl.russia = new google.maps.LatLng(49.8095222, 68.8103141);

    ctrl.cities = {
        chicago: {population:2714856, position: [41.878113, -87.629798]},
        newyork: {population:8405837, position: [40.714352, -74.005973]},
        losangeles: {population:3857799, position: [34.052234, -118.243684]},
        vancouver: {population:603502, position: [49.25, -123.1]},
      }

    ctrl.getRadius = function(num) {
        return Math.sqrt(num) * 100;
    }

    ctrl.goGermany = function() {
      ctrl.map.setCenter(ctrl.germany);
    }
    ctrl.goEngland = function() {
      ctrl.map.setCenter(ctrl.england);
    }
    ctrl.goRussia = function() {
      ctrl.map.setCenter(ctrl.russia);
    }

    /*  UI del Mapa con Material */

    //FAB Button test
    $scope.isOpen = false;
    $scope.demo = {
      isOpen: false,
      count: 0,
      selectedDirection: 'left'
    };
}