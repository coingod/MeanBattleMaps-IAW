angular.module('meanBattleMaps').component('myLogin', {
    templateUrl:'../my-login.component.html',
    controller: loginController
  });

//mapController.$inject = ['NgMap'];
 
function loginController($scope, NgMap, $mdDialog, $http){
    var ctrl = this; 

     $scope.showAdvanced = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '../loginform.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        //Answer: {email: 'blablabla', password:'blablabla'}
        $http.post('/api/authenticate', {"name":answer.name, "password":answer.password}).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(response.data);
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            window.alert("Error en el login.");
          });
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    };

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

      function DialogController($scope, $mdDialog) {
        //Defaults
        $scope.formData={};
        $scope.formData.name='admin';
        $scope.formData.password='admin';

        $scope.login=function(ev){
          $mdDialog.hide($scope.formData);
        }

      }
  
}