angular.module('meanBattleMaps').component('myMap', {
    templateUrl:'../my-map.component.html',
    controller: mapController
  });

//mapController.$inject = ['NgMap'];

function mapController($scope, NgMap){
    var ctrl = this;
    
    //Batalla de prueba
    var battle = {};
    battle.name = "Dia D";
    battle.operation = "Overlord";
    battle.conflict = "Segunda Guerra Mundial";
    battle.beligrants = ["Estados Unidos", "Alemania"];
    battle.date = new Date(1944, 6, 6);
    battle.location = "Normandia, Francia";
    battle.result = "Victoria Aliada";
    battle.markers = [
        {title: "Playa Utah", icon:"/assets/img/icons/battle.png", lat: 49.4222982, lng: -1.1968746},
        {title: "Playa Omaha", icon:"/assets/img/icons/battle.png", lat: 49.3726418, lng: -0.9377147},
        {title: "Playa Gold", icon:"/assets/img/icons/battle.png", lat: 49.3319829, lng: -0.5778482},
        {title: "Playa Juno", icon:"/assets/img/icons/battle.png", lat: 49.3260474, lng: -0.4601456},
        {title: "Playa Sword", icon:"/assets/img/icons/battle.png", lat: 49.3114565, lng: -0.3907291},
    ];

    //Arreglo con las batallas a mostrar en el mapa
    ctrl.battles = [battle];

    //Centramos la camara en la Batalla
    var bounds = new google.maps.LatLngBounds();
    for (var i=0; i<battle.markers.length; i++) {
      var latlng = new google.maps.LatLng(battle.markers[i].lat, battle.markers[i].lng);
      bounds.extend(latlng);
    }

    NgMap.getMap().then(function (map) {
        ctrl.map = map;
        ctrl.map.setCenter(bounds.getCenter());
        ctrl.map.fitBounds(bounds);
    });    

    /*
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
    */

    /*  UI del Mapa con Material */

    //FAB Button test
    $scope.isOpen = false;
    $scope.demo = {
      isOpen: false,
      count: 0,
      selectedDirection: 'left'
    };
}