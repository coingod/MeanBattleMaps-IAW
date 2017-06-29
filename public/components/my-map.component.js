angular.module('meanBattleMaps').component('myMap', {
  templateUrl: '../my-map.component.html',
  controller: mapController
});

//mapController.$inject = ['NgMap'];

function mapController($scope, NgMap, $mdSidenav, $mdDialog, $mdToast, $http, $mdBottomSheet, $rootScope) {
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
  //var battle = {};
  $rootScope.battle = {};//=battle;

  //Setea la batalla actual obtenida a partir de un JSON
  $rootScope.setBattle = function (newBattle) {
    $rootScope.battle = newBattle;

    //Preparamos los objetos Date
    var year = $rootScope.battle.start.year;
    var month = $rootScope.battle.start.month;
    var day = $rootScope.battle.start.day;
    $rootScope.battle.start = new Date(year, month, day);

    year = $rootScope.battle.end.year;
    month = $rootScope.battle.end.month;
    day = $rootScope.battle.end.day;
    $rootScope.battle.end = new Date(year, month, day);

    //battle = $rootScope.selectedBattle;
    $scope.centerView();
  }

  //Consultamos al servidor por la lista de batallas
  $http.get('/api/getbattles').then(function successCallback(response) {
    if (response.data.length) {
      //Si hay Batallas en la BD cargamos la primera como default
      //battle = response.data[0];
      //$rootScope.selectedBattle=battle;
      $rootScope.setBattle(response.data[0]);
      //$scope.centerView();
    }
  }, function errorCallback(response) {
    window.alert("Error del servidor.");
  });

  //Actualizamos una batalla en el servidor
  $scope.updateBattle = function (battle) {

    //Enviamos los datos al servidor
    $http.post('/api/updatebattle/' + battle._id+"?token="+$rootScope.tokenjwt, { "battle": battle }).then(function successCallback(response) {
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
  };

  //Arreglo con las batallas a mostrar en el mapa
  //ctrl.battles = [battle];

  //Envia al servidor la informacion de una batalla nueva para su almacenamiento
  $scope.saveBattle = function (ev) {
    //Preparamos las Fechas para el JSON
    var json = JSON.parse(JSON.stringify($rootScope.battle)); //Esto clona el objeto, en vez de copiar la referencia
    json.start = { year: $rootScope.battle.start.getFullYear(), month: $rootScope.battle.start.getMonth(), day: $rootScope.battle.start.getDay() };
    json.end = { year: $rootScope.battle.end.getFullYear(), month: $rootScope.battle.end.getMonth(), day: $rootScope.battle.end.getDay() };

    //Si tenemos una id, quiere decir que estamos editando una batalla
    if ("_id" in json) {
      $scope.updateBattle(json);
      return;
    }

    //Sino la batalla es nueva y procedemos a guardarla en el servidor 
    $http.post('/api/loadbattle?token='+$rootScope.tokenjwt, { "battle": json }).then(function successCallback(response) {
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

  //Consultamos la API de Wikipedia para obtener informacion de la Batalla
  $scope.connectToWikipedia = function (title) {
    //Reemplazamos los espacios por '_' como requiere la API
    //title.split(' ').join('_');
    //Consultamos a Wikipedia
    $http.jsonp('https://es.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&exintro&exsectionformat=plain&format=json&titles=' + title + '&callback=JSON_CALLBACK')
      .success(function (response) {
        var nropagina = Object.keys(response.query.pages)[0];
        //console.log(nropagina);
        if (nropagina != -1) {
          //console.log(response.query.pages[nropagina]);
          //Obtenemos el resumen de Wikipedia
          var datos = response.query.pages[nropagina].extract;
          //Le sacamos el código html
          $rootScope.battle.summary = datos.replace(/<[^>]*>?/g, '');
          //Mostramos alerta de exito
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('API Wikipedia')
              .textContent('Se ha obtenido informacion con exito.')
              .ariaLabel('Wikipedia Exito')
              .ok('Confirmar')
          );
        } else {
          //Mostramos alerta de falla
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('API Wikipedia')
              .textContent('No se a obtenido informacion de Wikipedia. Compruebe que el nombre corresponde a un articulo valido.')
              .ariaLabel('Wikipedia Fallo')
              .ok('Confirmar')
          );
        }
      });
  };

  //Centramos la camara en la Batalla
  $scope.centerView = function () {
    if (ctrl.map == undefined)
      return;

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < $rootScope.battle.markers.length; i++) {
      var latlng = new google.maps.LatLng($rootScope.battle.markers[i].lat, $rootScope.battle.markers[i].lng);
      bounds.extend(latlng);
    }
    for (var i = 0; i < $rootScope.battle.belligerents.length; i++) {
      for (var j = 0; j < $rootScope.battle.belligerents[i].armies.length; j++) {
        var latlng = new google.maps.LatLng($rootScope.battle.belligerents[i].armies[j].lat, $rootScope.battle.belligerents[i].armies[j].lng);
        bounds.extend(latlng);
      }
    }
    ctrl.map.setCenter(bounds.getCenter());
    ctrl.map.fitBounds(bounds);
  }

  ctrl.getRadius = function (num) {
    return Math.sqrt(num);
  };

  $scope.updateMarkerPosition = function (event, index) {
    $rootScope.battle.markers[index].lat = event.latLng.lat();
    $rootScope.battle.markers[index].lng = event.latLng.lng();
    //console.log(battle.markers[index]);
  }
  $scope.updateArmyPosition = function (event, faction_index, army_index) {
    $rootScope.battle.belligerents[faction_index].armies[army_index].lat = event.latLng.lat();
    $rootScope.battle.belligerents[faction_index].armies[army_index].lng = event.latLng.lng();
    //console.log(battle.belligerents[faction_index]);
  }
  /*
  $scope.updatePath = function(event, index) {
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

  $scope.newBattle = function (ev) {
    $rootScope.battle = {
      markers: [],
      belligerents: [],
      frontlines: []
    };
    //$rootScope.selectedBattle = battle;
    //console.log($rootScope.selectedBattle);
    $mdSidenav('right').toggle();
  };

  $scope.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };
  $scope.isOpenLeft = function () {
    return $mdSidenav('left').isOpen();
  };
  function buildToggler(componentId) {
    return function () {
      $mdSidenav(componentId).toggle();
    };
  }

  //Formulario de edicion de batalla
  $scope.showHints = true;

  //Agrega una nueva entrada en el arreglo de beligrantes (Nueva Faccion)
  $scope.addBelligerent = function (ev) {
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

    $mdDialog.show(confirm).then(function (result) {
      $rootScope.battle.belligerents.push({
        faction: result,
        armies: []
      });
    }, function () {
      //$scope.status = 'You didn\'t name your dog.';
    });
  };

  //Agrega un nuevo ejercito para una faccion
  $scope.addArmy = function (ev, faction) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/dialogs/belligerent-settings.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false//$scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
      .then(function (result) {
        //Buscamos la entrada de la faccion
        for (var i = 0; i < $rootScope.battle.belligerents.length; i++) {
          var element = $rootScope.battle.belligerents[i];
          if (element.faction == faction) {
            var new_id = 0;
            if (element.armies.length > 0) {
              new_id = element.armies[element.armies.length - 1].id + 1;
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
      }, function () {
        //$scope.status = 'You cancelled the dialog.';
      });
  };

  //Agrega un nuevo marcador
  $scope.addMarker = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/dialogs/marker-settings.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false//$scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
      .then(function (result) {
        var new_id = 0;
        if ($rootScope.battle.markers.length > 0) {
          new_id = $rootScope.battle.markers[$rootScope.battle.markers.length - 1].id + 1;
        }
        //Creamos la representacion del marcador
        var marker = {
          id: new_id,
          title: result.title,
          icon: {
            url: "/assets/img/icons/" + result.icon + ".png",
            size: [32, 32],
            origin: [0, 0],
            anchor: [16, 16]
          },
          lat: ctrl.map.data.map.center.lat(),
          lng: ctrl.map.data.map.center.lng(),
          casualties: result.casualties
        };
        //Lo agregamos a la lista de marcadores
        $rootScope.battle.markers.push(marker);
      }, function () {
        //$scope.status = 'You cancelled the dialog.';
      });
  };

  //Agrega un nuevo marcador
  $scope.addPath = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/dialogs/movements-settings.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false//$scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
      .then(function (result) {
        var new_id = 0;
        if ($rootScope.battle.frontlines.length > 0) {
          new_id = $rootScope.battle.frontlines[$rootScope.battle.frontlines.length - 1].id + 1;
        }
        icons_value = [];
        //Si es una flecha, agregamos la punta
        if (result.avatar == "trending_up") {
          icons_value = [{ icon: { path: 'FORWARD_CLOSED_ARROW' }, offset: '100%' }]
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
      }, function () {
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
  ctrl.drawPath = function (e) {
    //Si no estamos dibujando, retornar
    if (!ctrl.drawingPath)
      return;
    //Agregamos las coordenadas del click al path actual
    currentLine.path.push([e.latLng.lat(), e.latLng.lng()]);
    //Si agregamos el primer punto, ya podemos agregar el path a la estructura
    //De esta forma se empezara a ver en el mapa y el usuario sabra que esta dibujando
    if (currentLine.path.length == 1) {
      $rootScope.battle.frontlines.push(currentLine);
    }
    //var marker = new google.maps.Marker({position: e.latLng, map: ctrl.map});
    //console.log("[" + marker.getPosition().lat() + ", " + marker.getPosition().lng() + "]");
    //infowindow.open(ctrl.map, marker);
    //ctrl.map.panTo(e.latLng);
  };
  //Para finalizar de dibujar cambiamos el estado de drawingPath
  ctrl.finishDrawPath = function (e) {
    //Si no estamos dibujando, retornar
    if (!ctrl.drawingPath)
      return;
    //Terminamos de dibujar
    ctrl.drawingPath = false;
    currentLine = {};
    //Ocultamos el cartelito
    $mdToast.hide(toast_draingPath);
  };

  //Eliminar un faccion y todos sus ejercitos
  $scope.deleteFaction = function (ev, faction) {
    //Buscamos la entrada de la faccion
    var armies, index;
    for (var i = 0; i < $rootScope.battle.belligerents.length; i++) {
      var element = $rootScope.battle.belligerents[i];
      if (element.faction == faction) {
        index = i;
      }
    }
    //Creamos el dialogo de confirmacion de borrado
    var confirm = $scope.delete(ev, $rootScope.battle.belligerents[index].faction);
    //Procesamos la opcion del usuario
    $mdDialog.show(confirm).then(function () {
      //Eliminamos el ejercito del arreglo de ejercitos de la faccion
      $rootScope.battle.belligerents.splice(index, 1);
    }, function () {
      //console.log("CAncel");
    });
  };

  //Eliminar un Ejercito
  $scope.deleteArmy = function (ev, faction, armyID) {
    //Buscamos la entrada de la faccion
    var army, armies, index;
    for (var i = 0; i < $rootScope.battle.belligerents.length; i++) {
      var element = $rootScope.battle.belligerents[i];
      if (element.faction == faction) {
        for (var j = 0; j < element.armies.length; j++) {
          if (element.armies[j].id == armyID) {
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
    $mdDialog.show(confirm).then(function () {
      //Eliminamos el ejercito del arreglo de ejercitos de la faccion
      armies.splice(index, 1);
    }, function () {
      //console.log("CAncel");
    });
  };

  //Eliminar un Marcador
  $scope.deleteMarker = function (ev, markerID) {
    //Buscamos la entrada 
    var marker, index;
    for (var i = 0; i < $rootScope.battle.markers.length; i++) {
      var element = $rootScope.battle.markers[i];
      if (element.id == markerID) {
        marker = element;
        index = i;
      }
    }
    //Creamos el dialogo de confirmacion de borrado
    var confirm = $scope.delete(ev, marker.title);
    //Procesamos la opcion del usuario
    $mdDialog.show(confirm).then(function () {
      //Eliminamos el ejercito del arreglo de ejercitos de la faccion
      $rootScope.battle.markers.splice(index, 1);
    }, function () {
      //console.log("CAncel");
    });
  };

  //Eliminar un Path
  $scope.deletePath = function (ev, pathID) {
    //Buscamos la entrada
    var path, index;
    for (var i = 0; i < $rootScope.battle.frontlines.length; i++) {
      var element = $rootScope.battle.frontlines[i];
      if (element.id == pathID) {
        path = element;
        index = i;
      }
    }
    //Creamos el dialogo de confirmacion de borrado
    var confirm = $scope.delete(ev, path.title);
    //Procesamos la opcion del usuario
    $mdDialog.show(confirm).then(function () {
      //Eliminamos el ejercito del arreglo de ejercitos de la faccion
      $rootScope.battle.frontlines.splice(index, 1);
    }, function () {
      //console.log("CAncel");
    });
  };

  //Construye un dialogo de confirmacion de borrado generico
  $scope.delete = function (ev, element) {
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
    $scope.formData = {};

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.confirm = function () {
      $mdDialog.hide($scope.formData);
    };
  }
}