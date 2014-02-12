'use strict';

angular.module('sFetch.system').controller('IndexController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {

  // Initialize the controller
  var _init = function() {
    var anyFetchUrl = '/documents/?search=' + $scope.global.context.query + '&limit=50';
    $http({method: 'GET', url: anyFetchUrl}).
      success(function(data) {
        console.log(data);

        $scope.documentTypes = data.document_types;
        $scope.providers = data.providers;

        // Realease templating
        var documents = data.datas;
        documents.forEach( function(entry){
          var template = $scope.documentTypes[entry.document_type].template_snippet;
          entry.rendered = window.Mustache.render(template, entry.datas);
          entry.rendered += '<div style="clear:both"></div>';
        });

        console.log($scope.providers);
        console.log(documents);
        $scope.documents = documents;
      });
  };

  $scope.displayFull = function(doc) {
    window.parent.postMessage(doc.id, "*");
  };

  $scope.global = Global;
  _init();

}]);