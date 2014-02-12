'use strict';

angular.module('sFetch.system').controller('IndexController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {
  $scope.global = Global;

  var anyFetchUrl = '/documents/?search=' + $scope.global.context.query + '&limit=50';
  $http({method: 'GET', url: anyFetchUrl}).
    success(function(data) {
      console.log(data);
    }).error(function(data) {
      console.log(data);
    });
}]);