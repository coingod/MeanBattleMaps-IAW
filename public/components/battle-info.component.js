angular.module('meanBattleMaps').component('battleInfo', {
    templateUrl:'../battle-info.component.html',
    controller: battleInfoController
  });

//mapController.$inject = ['NgMap'];

function battleInfoController($http, $scope, $mdBottomSheet, $rootScope){
    var ctrl = this;
    //UI Lista de Batallas
    $scope.showBattleInfo = function() {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl:'../wiki-summary.html', // '../battle-list.html',
        controller: wikiController // BattleListCtrl
      })/*.then(function(clickedItem) {
        $scope.alert = clickedItem['name'] + ' clicked!';
      }).catch(function(error) {
        // User clicked outside or hit escape
      })*/;
    };

    function wikiController($http, $rootScope, $scope){
    //Probamos Api de Wikipedia+
      $http.jsonp('http://es.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles='+$rootScope.battle.name+'&callback=JSON_CALLBACK').success(function(response) {
          var nropagina=Object.keys(response.query.pages)[0];
          console.log(nropagina);
          console.log(response.query.pages[nropagina]);
          //Obtenemos el resumen de Wikipedia
          $scope.datos=response.query.pages[nropagina].extract;
          //Le sacamos el código html
          $scope.datos=$scope.datos.replace(/<[^>]*>?/g, '');
      });

      $scope.close = function() {
        $mdBottomSheet.hide();
      };
    }
}