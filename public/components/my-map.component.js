angular.
  module('meanBattleMaps').
  component('myMap', {
    templateUrl:'../my-map.component.html',
    controller: function myMapController() {
      this.center={latitude:45, longitude:45}
    }
  });