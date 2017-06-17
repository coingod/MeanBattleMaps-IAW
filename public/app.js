var app = angular.module('meanBattleMaps', ['ngMaterial', 'ngMap']);

app.controller('appController', function($scope, $location, NgMap) {

  //Configuramos la URL de la web para el plugin de FB
  $scope.fbhref=$location.absUrl();

});