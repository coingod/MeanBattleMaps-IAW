var map = angular.module('meanBattleMaps', ['ngMaterial', 'ngMap']);

map.controller('mapController', function($scope, $location, NgMap) {
  $scope.fbhref=$location.absUrl();
  /*
  NgMap.getMap().then(function(map) {
    console.log(map.getCenter().toString());
  });
  */

  //FAB Button test
  $scope.isOpen = false;
  $scope.demo = {
    isOpen: false,
    count: 0,
    selectedDirection: 'left'
  };

  //ng-map
  var vm = this;
  NgMap.getMap().then(function(map) {
    vm.map = map;
  });

  vm.germany = new google.maps.LatLng(51.0852265, 5.968913);
  vm.england = new google.maps.LatLng(52.7613184, -6.8044202);
  vm.russia = new google.maps.LatLng(49.8095222, 68.8103141);

  vm.cities = {
      chicago: {population:2714856, position: [41.878113, -87.629798]},
      newyork: {population:8405837, position: [40.714352, -74.005973]},
      losangeles: {population:3857799, position: [34.052234, -118.243684]},
      vancouver: {population:603502, position: [49.25, -123.1]},
    }

  vm.getRadius = function(num) {
      return Math.sqrt(num) * 100;
  }

  vm.goGermany = function() {
    vm.map.setCenter(vm.germany);
  }
  vm.goEngland = function() {
    vm.map.setCenter(vm.england);
  }
  vm.goRussia = function() {
    vm.map.setCenter(vm.russia);
  }

});