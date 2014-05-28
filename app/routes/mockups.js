'use strict';

// Application routes use applications controller
var appControllers = require('../controllers/mockups');

module.exports = function(app) {
  app.get('/mockups/context-search', appControllers.contextSearch);
};
