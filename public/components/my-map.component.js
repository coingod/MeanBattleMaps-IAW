angular.module('meanBattleMaps').component('myMap', {
    templateUrl:'../my-map.component.html',
    controller: mapController
  });

//mapController.$inject = ['NgMap'];

function mapController($scope, NgMap, $mdSidenav, $mdDialog, $mdToast){
    var ctrl = this;
    //En modo de creacion de lineas, esta variable indica el estado del path
    var currentLine = {};
    //Activa/desactiva el modo dibujado de paths
    ctrl.drawingPath = false;
    
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
        {id:0, title: "Playa Utah", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.4222982, lng: -1.1968746, casualties: 197},
        {id:1, title: "Playa Omaha", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3726418, lng: -0.9077147, casualties: 2000},
        {id:2, title: "Playa Gold", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3319829, lng: -0.5778482, casualties: 1000},
        {id:3, title: "Playa Juno", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3260474, lng: -0.4601456, casualties: 961},
        {id:4, title: "Playa Sword", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3214565, lng: -0.3907291, casualties: 1000},
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
          id: 0,
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
          id: 1,
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
          id: 2,
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
          id: 3,
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
          id: 4,
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
          id: 5,
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
          id: 6,
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
    };
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

    //Agrega una nueva entrada en el arreglo de beligrantes (Nueva Faccion)
    $scope.addBelligerent = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
        .title('Nuevo Beligrante')
        .textContent('Ingrese un nombre representativo para esta Faccion.')
        .placeholder('Ej: Templarios')
        .ariaLabel('Nombre de la Faccion')
        //.initialValue('Aliados')
        .targetEvent(ev)
        .ok('Confirmar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function(result) {
        battle.belligerents.push({
          faction: result,
          armies: []
        });
      }, function() {
        //$scope.status = 'You didn\'t name your dog.';
      });
    };

    //Agrega un nuevo ejercito para una faccion
    $scope.addArmy = function(ev, faction) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/dialogs/belligerent-settings.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: false//$scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(result) {
        //Buscamos la entrada de la faccion
        for (var i = 0; i < battle.belligerents.length; i++) {
          var element = battle.belligerents[i];
          if(element.faction == faction){
            var new_id = 0;
            if(element.armies.length > 0){
              new_id = element.armies[element.armies.length-1].id + 1;
            }
            //Creamos la representacion del ejercito
            var army = {
              id: new_id, 
              title: result.title, 
              icon: result.icon, 
              lat: ctrl.map.data.map.center.lat(), 
              lng: ctrl.map.data.map.center.lng(), 
              strength: result.strength
            }
            //Lo agregamos a la lista de ejercitos de la faccion
            element.armies.push(army);
          }
        }
      }, function() {
        //$scope.status = 'You cancelled the dialog.';
      });
    };

    //Agrega un nuevo marcador
    $scope.addMarker = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/dialogs/marker-settings.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: false//$scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(result) {
        var new_id = 0;
        if(battle.markers.length > 0){
          new_id = battle.markers[battle.markers.length-1].id + 1;
        }
        //Creamos la representacion del marcador
        var marker = {
          id: new_id,
          title: result.title, 
          icon: {
            url:"/assets/img/icons/"+ result.icon +".png", 
            size: [32, 32], 
            origin: [0,0], 
            anchor: [16, 16]
          }, 
          lat: ctrl.map.data.map.center.lat(), 
          lng: ctrl.map.data.map.center.lng(), 
          casualties: result.casualties
        };
        //Lo agregamos a la lista de marcadores
        battle.markers.push(marker);
      }, function() {
        //$scope.status = 'You cancelled the dialog.';
      });
    };

    //Agrega un nuevo marcador
    $scope.addPath = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/dialogs/movements-settings.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: false//$scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(result) {
        var new_id = 0;
        if(battle.frontlines.length > 0){
          new_id = battle.frontlines[battle.frontlines.length-1].id + 1;
        }
        icons_value = [];
        //Si es una flecha, agregamos la punta
        if(result.avatar == "trending_up"){
          icons_value = [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        }
        //Creamos la representacion de la frontera/movimiento
        var line = {
          id: new_id,
          avatar: result.avatar, 
          title: result.title,
          color: result.color,
          //Agregamos como origen la posicion actual
          path: [
            //[ctrl.map.data.map.center.lat(), ctrl.map.data.map.center.lng()]
          ],
          icons: icons_value
        };
        //El path que creamos esta vacio, por esta razon no lo podemos agregar aun al mapa.
        //Para que el usuario comienza a indicar los puntos del path, marcamos 
        //que esta actualmente seleccionado e indicamos que estamos dibujandolo
        //VER "drawPath"
        currentLine = line;
        ctrl.drawingPath = true;
        //Alertamos al usuario cual es el boton para terminar de dibujar
        $mdToast.show(toast_draingPath);
      }, function() {
        //$scope.status = 'You cancelled the dialog.';
      });
    };

    //Mensajito para recordar al usuario como finalizar de dibujar un path
    var toast_draingPath = $mdToast.simple()
      .textContent('Para finalizar el trazo haga Click Derecho sobre el mapa')
      .hideDelay(50000000)
      .position('top');

    //Esta funcion agrega puntos al path, actualmente seleccionado, en donde el usuario haga click.
    //Solo funciona cuando drawingPAth es verdadero.
    ctrl.drawPath = function(e) {
      //Si no estamos dibujando, retornar
      if(!ctrl.drawingPath)
        return;
      //Agregamos las coordenadas del click al path actual
      currentLine.path.push([e.latLng.lat(), e.latLng.lng()]);
      //Si agregamos el primer punto, ya podemos agregar el path a la estructura
      //De esta forma se empezara a ver en el mapa y el usuario sabra que esta dibujando
      if(currentLine.path.length == 1){
        battle.frontlines.push(currentLine);
      }
      //var marker = new google.maps.Marker({position: e.latLng, map: ctrl.map});
      //console.log("[" + marker.getPosition().lat() + ", " + marker.getPosition().lng() + "]");
      //infowindow.open(ctrl.map, marker);
      //ctrl.map.panTo(e.latLng);
    };
    //Para finalizar de dibujar cambiamos el estado de drawingPath
    ctrl.finishDrawPath = function(e) {
      //Si no estamos dibujando, retornar
      if(!ctrl.drawingPath)
        return;
      //Terminamos de dibujar
      ctrl.drawingPath = false;
      currentLine = {};
      //Ocultamos el cartelito
      $mdToast.hide(toast_draingPath);
    };

    //Eliminar un Ejercito
    $scope.deleteArmy = function(ev, faction, armyID) {
      //Buscamos la entrada de la faccion
      var army, armies, index;
      for (var i = 0; i < battle.belligerents.length; i++) {
        var element = battle.belligerents[i];
        if(element.faction == faction){
          for (var j = 0; j < element.armies.length; j++) {
            if(element.armies[j].id == armyID) {
              army = element.armies[j];
              armies = element.armies;
              index = j;
            }
          }
        }
      }
      //Creamos el dialogo de confirmacion de borrado
      var confirm = $scope.delete(ev, army.title);
      //Procesamos la opcion del usuario
      $mdDialog.show(confirm).then(function() {
        //Eliminamos el ejercito del arreglo de ejercitos de la faccion
        armies.splice(index, 1);
      }, function() {
        //console.log("CAncel");
      });
    };

    //Eliminar un Marcador
    $scope.deleteMarker = function(ev, markerID) {
      //Buscamos la entrada 
      var marker, index;
      for (var i = 0; i < battle.markers.length; i++) {
        var element = battle.markers[i];
        if(element.id == markerID){
          marker = element;
          index = i;
        }
      }
      //Creamos el dialogo de confirmacion de borrado
      var confirm = $scope.delete(ev, marker.title);
      //Procesamos la opcion del usuario
      $mdDialog.show(confirm).then(function() {
        //Eliminamos el ejercito del arreglo de ejercitos de la faccion
        battle.markers.splice(index, 1);
      }, function() {
        //console.log("CAncel");
      });
    };

    //Eliminar un Path
    $scope.deletePath = function(ev, pathID) {
      //Buscamos la entrada
      var path, index;
      for (var i = 0; i < battle.frontlines.length; i++) {
        var element = battle.frontlines[i];
        if(element.id == pathID){
          path = element;
          index = i;
        }
      }
      //Creamos el dialogo de confirmacion de borrado
      var confirm = $scope.delete(ev, path.title);
      //Procesamos la opcion del usuario
      $mdDialog.show(confirm).then(function() {
        //Eliminamos el ejercito del arreglo de ejercitos de la faccion
        battle.frontlines.splice(index, 1);
      }, function() {
        //console.log("CAncel");
      });
    };

    //Construye un dialogo de confirmacion de borrado generico
    $scope.delete = function(ev, element) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
            .title('Esta seguro que desea eliminar ' + element + '?')
            .textContent('Esta accion no se puede deshacer.')
            .ariaLabel('Eliminar')
            .targetEvent(ev)
            .ok('Confirmar')
            .cancel('Cancelar');
      return confirm;
    };

    function DialogController($scope, $mdDialog) {
      $scope.formData={};

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.confirm = function() {
        $mdDialog.hide($scope.formData);
      };
    }
}