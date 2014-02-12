'use strict';

angular.module('sFetch.system').controller('IndexController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {
  $scope.global = Global;

  var anyFetchUrl = '/documents/?search=' + $scope.global.context.query + '&limit=50';
  $http({method: 'GET', url: anyFetchUrl}).
    success(function(data) {
      // console.log(data);

      $scope.documentTypes = data.document_types;
      $scope.providers = data.providers;

      var documents = data.datas;
      documents.forEach( function(entry){
        var template = $scope.documentTypes[entry.document_type].template_snippet;
        entry.rendered = window.Mustache.render(template, entry.datas);
      });

      $scope.documents = documents;
      console.log($scope.documents);
    });
}]);