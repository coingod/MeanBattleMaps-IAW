angular.module('meanBattleMaps').component('myLogin', {
  templateUrl: '../my-login.component.html',
  controller: loginController
});

//mapController.$inject = ['NgMap'];

function loginController($scope, NgMap, $mdDialog, $mdMenu, $http, localStorageService, $rootScope) {
  var ctrl = this;
  //Chequeamos a ver si hay un token almacenado previamente
  //Si existe un token debemos chequear que todavía sea valido
  $http.get('/api/check?token=' + localStorageService.get('tokenjwt')).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
    //console.log(response.data);
    if (response.data.success == false) {
      //Token expiró, debe volver a autenticarse!
      $rootScope.adminLogged = false;
    }
    else {
      //We're in! Yaaaay
      $rootScope.adminLogged = true;
    }
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    $rootScope.adminLogged = false;
    window.alert("Error del servidor.");
  });


  $scope.openMenu = function ($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  }

  $scope.logOut = function (ev) {
    localStorageService.set('tokenjwt', null);
    $rootScope.tokenjwt=null;
    $rootScope.adminLogged = false;
  }

  $scope.showAdvanced = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '../forms/form-login.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
      .then(function (answer) {
        //Answer: {email: 'blablabla', password:'blablabla'}
        $http.post('/api/authenticate', { "name": answer.name, "password": answer.password }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(response.data);
          if (response.data.success == true) {
            //Mostrar botón de edicion
            //TOKEN=response.data.token
            localStorageService.set('tokenjwt', response.data.token);
            $rootScope.adminLogged = true;
            $rootScope.tokenjwt=response.data.token;
          }
          else {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Error')
                .textContent('Combinacion usuario/contraseña incorrecta.')
                .ok('OK')
                .targetEvent(ev)
            );
          }
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          window.alert("Error del servidor.");
        });
      }, function () {
        $scope.status = 'You cancelled the dialog.';
      });
  };

  $scope.doPrimaryAction = function (event) {
    console.log(event);
  };

  /*  UI del Mapa con Material */
  /*
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
  */
  function DialogController($scope, $mdDialog) {
    //Defaults
    $scope.formData = {};
    $scope.formData.name = 'admin';
    $scope.formData.password = 'admin';

    $scope.login = function (ev) {
      $mdDialog.hide($scope.formData);
    }

  }

}