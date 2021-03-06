angular.module('meanBattleMaps').component('listButton', {
    templateUrl:'../list-button.component.html',
    controller: listButtonController
  });

//mapController.$inject = ['NgMap'];

function listButtonController($http, $scope, $mdBottomSheet, $rootScope){
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
/*
     $scope.showBattleInfo = function() {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl:'../wiki-summary.html', // '../battle-list.html',
        controller: wikiController // BattleListCtrl
      })/*.then(function(clickedItem) {
        $scope.alert = clickedItem['name'] + ' clicked!';
      }).catch(function(error) {
        // User clicked outside or hit escape
      });
    };

    function wikiController($http, $rootScope, $scope){
    //Probamos Api de Wikipedia+
      $http.jsonp('http://es.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles='+$rootScope.battle.name+'&callback=JSON_CALLBACK').success(function(response) {
          var nropagina=Object.keys(response.query.pages)[0];
          console.log(nropagina);
          console.log(response.query.pages[nropagina]);
          $scope.datos=response.query.pages[nropagina].extract;
          $scope.datos=$scope.datos.replace(/<[^>]*>?/g, '');
      });

      $scope.close = function() {
        $mdBottomSheet.hide();
      };
    }
  */
    function BattleListCtrl($http, $scope, $mdBottomSheet) {
      $scope.items = [];
      
      //Chequeamos las batallas cargadas en la db
      $http.get('/api/getbattles').then(function successCallback(response) {
          //console.log(response);
          $scope.items = response.data;
        }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        window.alert("Error del servidor.");
      });
      
      $scope.selected = [];
      $scope.selectBattle=function(obj){
        //$rootScope.selectedBattle=obj;
        $rootScope.setBattle(obj);
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