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
            {id:0, title: "4º Division", icon:"us", lat: 49.5222982, lng: -0.9968746, strength: 23300},
            {id:1, title: "1º y 29º Division", icon:"us", lat: 49.4726418, lng: -0.8077147, strength: 34230},
            {id:2, title: "50º Division", icon:"uk", lat: 49.4319829, lng: -0.5278482, strength: 25000},
            {id:3, title: "3º Division", icon:"ca", lat: 49.4260474, lng: -0.4101456, strength: 21400},
            {id:4, title: "3º Division", icon:"uk", lat: 49.4214565, lng: -0.3007291, strength: 28850}
          ],
          strength: 156000,
          casualties: 10000
        },
        {
          faction: "Eje",
          armies:
          [
            {id:0, title: "352º Division Infanteria", icon:"ge", lat: 49.2222982, lng: -1.1968746, strength: 0},
            {id:1, title: "VII Ejercito", icon:"ge", lat: 49.0726418, lng: -0.9077147, strength: 0},
            {id:2, title: "716º Division Infanteria", icon:"ge", lat: 49.1319829, lng: -0.5778482, strength: 0},
            {id:3, title: "XV Ejercito", icon:"ge", lat: 49.1060474, lng: -0.3601456, strength: 0},
            {id:4, title: "21º Division Panzer", icon:"ge", lat: 49.1214565, lng: -0.3007291, strength: 0}
          ],
          strength: 50350,
          casualties: 6500
        }
    ];
    battle.frontlines = [
        {
          avatar:"trending_up", 
          title:"Desembarco 1", 
          color:"red",
          path: [
            [49.5122982,-1.0068746], 
            [49.4412982, -1.1668746]
          ], 
          icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        },
        {
          avatar:"trending_up", 
          title:"Desembarco 2",
          color:"red",
          path: [
            [49.4726418, -0.8077147], 
            [49.3726418, -0.9077147]
          ], 
          icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        },
        {
          avatar:"trending_up", 
          title:"Desembarco 3", 
          color:"red",
          path: [
            [49.4319829, -0.5278482], 
            [49.3319829, -0.5778482]
          ], 
          icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        },
        {
          avatar:"trending_up", 
          title:"Desembarco 4", 
          color:"red",
          path: [
            [49.4260474, -0.4101456],
            [49.3260474, -0.4601456]
          ], 
          icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        },
        {
          avatar:"trending_up", 
          title:"Desembarco 5", 
          color:"red",
          path: [
            [49.4214565, -0.3007291], 
            [49.3214565, -0.3907291]
          ], 
          icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        },
        {
          avatar:"show_chart", 
          title:"12 de Junio de 1944",
          color:"red",
          path: [
            [49.463661554130816, -1.231842041015625],
            [49.426160395179274, -1.327972412109375],
            [49.348388163438194, -1.344451904296875],
            [49.30811283252169, -1.201629638671875],
            [49.283035996995174, -1.10687255859375],
            [49.174521518067834, -0.965423583984375],
            [49.10444366870733, -0.77178955078125],
            [49.20683172516032, -0.60699462890625],
            [49.2032427441791, -0.330963134765625],
            [49.222081988283755, -0.240325927734375],
            [49.29109779978075, -0.24169921875]
          ]
        },
        {
          avatar:"show_chart", 
          title:"25 de Junio de 1944",
          color:"blue",
          path: [
            [49.257050109522424, -1.669921875],
            [49.19426915204543, -1.34033203125],
            [49.08106236432073, -1.1370849609375],
            [49.11702904077932, -0.92010498046875],
            [49.0729662700941, -0.800628662109375],
            [49.10893881094389, -0.560302734375],
            [49.0945529223241, -0.384521484375],
            [49.112534631533656, -0.243072509765625],
            [49.21670007971534, -0.20050048828125],
            [49.29199347427707, -0.199127197265625]
          ]
        },
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
    ctrl.toggleBounce = function() {
      if (this.getAnimation() != null) {
        this.setAnimation(null);
      } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    */

    //Para debugear
    ctrl.placeMarker = function(e) {
      //var contentString = e.latLng;
      //var infowindow = new google.maps.InfoWindow({content: contentString});
      var marker = new google.maps.Marker({position: e.latLng, map: ctrl.map});
      console.log("[" + marker.getPosition().lat() + ", " + marker.getPosition().lng() + "]");
      //infowindow.open(ctrl.map, marker);
      //ctrl.map.panTo(e.latLng);
    }


    /*  UI del Mapa con Material */
    
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    $scope.isOpenLeft = function(){
      return $mdSidenav('left').isOpen();
    };
    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    //Formulario de edicion de batalla
    $scope.showHints = true;

    $scope.doPrimaryAction = function(event) {
      //ctrl.map.setCenter(ctrl.england);
      console.log(event);
      /*
      $mdDialog.show(
        $mdDialog.alert()
          .title('Primary Action')
          .textContent('Primary actions can be used for one click actions')
          .ariaLabel('Primary click demo')
          .ok('Awesome!')
          .targetEvent(event)
      );
      */
  };
}