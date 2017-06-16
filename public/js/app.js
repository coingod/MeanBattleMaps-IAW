var map = angular.module('meanBattleMaps', ['ngMaterial', 'ngMap']);

map.controller('mapController', function($scope, $location, NgMap) {
  $scope.fbhref=$location.absUrl();
  NgMap.getMap().then(function(map) {
    console.log(map.getCenter().toString());
  });
});