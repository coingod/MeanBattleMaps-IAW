angular.module('meanBattleMaps').component('wikiSummary', {
    templateUrl:'../wiki-summary.component.html',
    controller: wikiController
  });

  function wikiController($http, $rootScope, $scope){
    //Probamos Api de Wikipedia+
    $http.jsonp('http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Cold War&callback=JSON_CALLBACK').success(function(response) {
        var nropagina=Object.keys(response.query.pages)[0];
        console.log(nropagina);
        console.log(response.query.pages[nropagina].extract);
    });
  }