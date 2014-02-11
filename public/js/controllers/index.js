'use strict';

angular.module('sFetch.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
  $scope.global = Global;

  console.log($scope);
}]);