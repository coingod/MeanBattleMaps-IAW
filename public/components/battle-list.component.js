angular.module('meanBattleMaps').component('battleList', {
    templateUrl:'../battle-list.component.html',
    controller: battleListController
  });

//mapController.$inject = ['NgMap'];

function battleListController($http, $scope, $mdBottomSheet, $rootScope){
    var ctrl = this;
    //UI Lista de Batallas
    $scope.showBattleList = function() {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: '../battle-list.html',
        controller: BattleListCtrl
      })/*.then(function(clickedItem) {
        $scope.alert = clickedItem['name'] + ' clicked!';
      }).catch(function(error) {
        // User clicked outside or hit escape
      })*/;
    };

    function BattleListCtrl($http, $scope, $mdBottomSheet) {
      $scope.items = [];
      
      //Chequeamos las batallas cargadas en la db
      $http.get('/api/getbattles').then(function successCallback(response) {
          console.log(response);
          $scope.items = response.data;
        }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        window.alert("Error del servidor.");
      });

      $scope.selected = [];
      $scope.selectBattle=function(obj){
        console.log("rootScope before select");
        console.log($rootScope.selectedBattle);

        $rootScope.selectedBattle=obj;
        console.log("Estoy en root!!");
        console.log($rootScope.selectedBattle);
      }
      $scope.query = {
        order: 'name',
        limit: 5,
        page: 1
      };
      
      $scope.close = function() {
        $mdBottomSheet.hide();
      };
    }
}