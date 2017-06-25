angular.module('meanBattleMaps').component('myMap', {
    templateUrl:'../my-map.component.html',
    controller: mapController
  });

//mapController.$inject = ['NgMap'];

function mapController($scope, NgMap, $mdSidenav, $mdDialog, $mdToast, $http, $mdBottomSheet, $rootScope){
    var ctrl = this;
    //En modo de creacion de lineas, esta variable indica el estado del path
    var currentLine = {};
    //Activa/desactiva el modo dibujado de paths
    ctrl.drawingPath = false;

    NgMap.getMap().then(function (map) {
      ctrl.map = map;
      $scope.centerView();
    });  
    
    //Batalla Actual
    var battle = {};
    $rootScope.selectedBattle=battle;

    //Consultamos al servidor por la lista de batallas
    $http.get('/api/getbattles').then(function successCallback(response) {
      if(response.data.length) {
        //Si hay Batallas en la BD cargamos la primera como default
        battle = response.data[0];
        $rootScope.selectedBattle=battle;
        //$scope.centerView();
      }
      }, function errorCallback(response) {
      window.alert("Error del servidor.");
    });


    $scope.updateBattle = function(id) {
        /*
        $http.get('/api/battle/'+x).then(function successCallback(response) {
            console.log("Antes del update!");
            console.log(response);
          }, function errorCallback(response) {window.alert("Error del servidor.");});
          */
        //UPdateamos
        $http.post('/api/updatebattle/'+id, {"battle": battle}).then(function successCallback(response) {
          console.log(response.data);
          $mdDialog.show(
            $mdDialog.alert()
              //.parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Batalla Actualizada')
              .textContent('La Batalla ha sido actualizada con exito.')
              .ariaLabel('Batalla Actualizada')
              .ok('Confirmar')
              //.targetEvent(ev)
          );
        }, function errorCallback(response) {
          // called asynchronously if an error occurs or server returns response with an error status.
          window.alert("Error del servidor.");
        });
        /*
        $http.get('/api/battle/'+x).then(function successCallback(response) {
          console.log("Despues del update!");
          console.log(response);
        }, function errorCallback(response) {window.alert("Error del servidor.");});
        */
      };

    //Arreglo con las batallas a mostrar en el mapa
    ctrl.battles = [battle];
    
    //Envia al servidor la informacion de una batalla nueva para su almacenamiento
    $scope.saveBattle = function(ev) {
      //Si tenemos una id, quiere decir que estamos editando una batalla
      if("_id" in battle){
        $scope.updateBattle(battle._id);
        return;
      }
      //Sino la batalla es nueva y procedemos a guardarla en el servidor 
      $http.post('/api/loadbattle', {"battle": battle}).then(function successCallback(response) {
        $mdDialog.show(
          $mdDialog.alert()
            //.parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Batalla Guardada')
            .textContent('La Batalla ha sido guardada con exito.')
            .ariaLabel('Batalla guardada')
            .ok('Confirmar')
            .targetEvent(ev)
        );
      }, function errorCallback(response) {
        // called asynchronously if an error occurs or server returns response with an error status.
        window.alert("Error del servidor.");
      });
    };

    //Centramos la camara en la Batalla
    $scope.centerView = function () {
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
      ctrl.map.setCenter(bounds.getCenter());
      ctrl.map.fitBounds(bounds);
    }  

    ctrl.getRadius = function(num) {
        return Math.sqrt(num);
    };

    $scope.updateMarkerPosition = function(event, index){
      battle.markers[index].lat = event.latLng.lat();
      battle.markers[index].lng = event.latLng.lng();
      //console.log(battle.markers[index]);
    }
    $scope.updateArmyPosition = function(event, faction_index, army_index){
      battle.belligerents[faction_index].armies[army_index].lat = event.latLng.lat();
      battle.belligerents[faction_index].armies[army_index].lng = event.latLng.lng();
      //console.log(battle.belligerents[faction_index]);
    }
    /*
    $scope.updatePath = function(event) {
      console.log(event);
      var vertex = event.vertex;
      var edge = event.edge;
      var latLng = event.latLng;
      console.log("Event: v:"+vertex+" e:"+edge+" latlng:"+latLng.lat()+","+latLng.lng());
    };
    */

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

    $scope.newBattle = function(ev) {
      battle = {
        markers: [],
        belligerents: [],
        frontlines: []
      };
      $rootScope.selectedBattle = battle;
      //console.log($rootScope.selectedBattle);
      $mdSidenav('right').toggle();
    };

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