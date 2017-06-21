angular.module('meanBattleMaps').component('facebookComments', {
    templateUrl:'../facebook-comments.component.html',
    controller: facebookCommentsController
  });

function facebookCommentsController($scope, $mdSidenav){
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
}