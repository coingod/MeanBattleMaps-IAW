var app = angular.module('meanBattleMaps', ['ngMaterial', 'ngMap', 'ngAnimate', 'vAccordion', 'md.data.table', 'ui.router']);

// our controller for the form
// =============================================================================
app.controller('appController', function($scope, $location, NgMap) {

  //Configuramos la URL de la web para el plugin de FB
  $scope.fbhref=$location.absUrl();

  // function to process the form
  $scope.processForm = function() {
      alert('awesome!');
  };

});

// configuring our routes 
// =============================================================================
app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: '/forms/form.html',
            controller: 'appController'
        })

        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/basicinfo)
        .state('form.basicinfo', {
            url: '/basicinfo',
            templateUrl: '/forms/form-basicinfo.html'
        })

        // url will be /form/belligerents
        .state('form.belligerents', {
            url: '/belligerents',
            templateUrl: '/forms/form-belligerents.html'
        })

        // url will be /form/markers
        .state('form.markers', {
            url: '/markers',
            templateUrl: '/forms/form-markers.html'
        })

        // url will be /form/movements
        .state('form.movements', {
            url: '/movements',
            templateUrl: '/forms/form-movements.html'
        });

    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/basicinfo');
})