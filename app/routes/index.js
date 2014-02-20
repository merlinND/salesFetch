'use strict';

var website = require('../controllers/website');

module.exports = function(app) {

  // Home route
  app.get('/', website);

};