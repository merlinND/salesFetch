'use strict';

module.exports = function(app) {

  // Home route
  var index = require('../controllers/website');
  app.get('/', index);

};