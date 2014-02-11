'use strict';

//Global service for global variables
angular.module('sFetch.system').factory('Global', [
  function() {
    var _this = this;
    _this._data = {
      creds: window.creds,
      context: window.context,
    };

    return _this._data;
  }
]);