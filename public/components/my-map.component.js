angular.module('meanBattleMaps').component('myMap', {
    templateUrl:'../my-map.component.html',
    controller: mapController
  });

//mapController.$inject = ['NgMap'];

function mapController($scope, NgMap, $mdSidenav){
    var ctrl = this;
    
    //Batalla de prueba
    var battle = {};
    battle.name = "Dia D";
    battle.operation = "Overlord";
    battle.conflict = "Segunda Guerra Mundial";
    battle.start = new Date(1944, 6, 6);
    battle.end = new Date(1944, 6, 6);
    battle.location = "Normandia, Francia";
    battle.result = "Victoria Aliada";
    battle.markers = [
        {title: "Playa Utah", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.4222982, lng: -1.1968746, casualties: 197},
        {title: "Playa Omaha", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3726418, lng: -0.9077147, casualties: 2000},
        {title: "Playa Gold", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3319829, lng: -0.5778482, casualties: 1000},
        {title: "Playa Juno", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3260474, lng: -0.4601456, casualties: 961},
        {title: "Playa Sword", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3214565, lng: -0.3907291, casualties: 1000},
    ];
    battle.belligerents = [
        {
          faction: "Aliados",
          armies:
          [
            {title: "4º Division", icon:"/assets/img/flags/us.png", lat: 49.5222982, lng: -0.9968746, strength: 23300},
            {title: "1º y 29º Division", icon:"/assets/img/flags/us.png", lat: 49.4726418, lng: -0.8077147, strength: 34230},
            {title: "50º Division", icon:"/assets/img/flags/uk.png", lat: 49.4319829, lng: -0.5278482, strength: 25000},
            {title: "3º Division", icon:"/assets/img/flags/can.png", lat: 49.4260474, lng: -0.4101456, strength: 21400},
            {title: "3º Division", icon:"/assets/img/flags/uk.png", lat: 49.4214565, lng: -0.3007291, strength: 28850}
          ],
          strength: 156000,
          casualties: 10000
        },
        {
          faction: "Eje",
          armies:
          [
            {title: "352º Division Infanteria", icon:"/assets/img/flags/ger.png", lat: 49.2222982, lng: -1.1968746, strength: 0},
            {title: "VII Ejercito", icon:"/assets/img/flags/ger.png", lat: 49.0726418, lng: -0.9077147, strength: 0},
            {title: "716º Division Infanteria", icon:"/assets/img/flags/ger.png", lat: 49.1319829, lng: -0.5778482, strength: 0},
            {title: "XV Ejercito", icon:"/assets/img/flags/ger.png", lat: 49.1060474, lng: -0.3601456, strength: 0},
            {title: "21º Division Panzer", icon:"/assets/img/flags/ger.png", lat: 49.1214565, lng: -0.3007291, strength: 0}
          ],
          strength: 50350,
          casualties: 6500
        }
    ];
    battle.movements = [
        {lat0: 49.5122982, lng0: -1.0068746, lat1: 49.4412982, lng1: -1.1668746, icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]},
        {lat0: 49.4726418, lng0: -0.8077147, lat1: 49.3726418, lng1: -0.9077147, icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]},
        {lat0: 49.4319829, lng0: -0.5278482, lat1: 49.3319829, lng1: -0.5778482, icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]},
        {lat0: 49.4260474, lng0: -0.4101456, lat1: 49.3260474, lng1: -0.4601456, icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]},
        {lat0: 49.4214565, lng0: -0.3007291, lat1: 49.3214565, lng1: -0.3907291, icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]}
    ]

    $scope.battle = battle;

    //Arreglo con las batallas a mostrar en el mapa
    ctrl.battles = [battle];

    //Centramos la camara en la Batalla
    var bounds = new google.maps.LatLngBounds();
    for (var i=0; i<battle.markers.length; i++) {
      var latlng = new google.maps.LatLng(battle.markers[i].lat, battle.markers[i].lng);
      bounds.extend(latlng);
    }
    for (var i=0; i<battle.belligerents.length; i++) {
      for (var j=0; j<battle.belligerents[i].armies.length; j++) {
        var latlng = new google.maps.LatLng(battle.belligerents[i].armies[j].lat, battle.belligerents[i].armies[j].lng);
        bounds.extend(latlng);
      }
    }

    NgMap.getMap().then(function (map) {
        ctrl.map = map;
        ctrl.map.setCenter(bounds.getCenter());
        ctrl.map.fitBounds(bounds);
    });    

    ctrl.getRadius = function(num) {
        return Math.sqrt(num);
    }

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

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    //Formulario de edicion de batalla
    $scope.showHints = true;
}