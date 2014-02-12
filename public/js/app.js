'use strict';

angular.module('sFetch', ['ngCookies', 'ngResource', 'ngRoute', 'sFetch.system']);

angular.module('sFetch.system', []);

//Setting HTML5 Location Mode
angular.module('sFetch').config(['$sceProvider',function($sceProvider) {

  // Disable templating HTML protection for Mustache
  $sceProvider.enabled(false);

}]);