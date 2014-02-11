'use strict';

//Global service for global variables
angular.module('sFetch.system').factory('Global', [
  function() {
    var _this = this;
    _this._data = {
      user: window.user,
    };

    return _this._data;
  }
]);