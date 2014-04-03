'use strict';

// Application routes use applications controller
var appControllers = require('../controllers/app');
var authorization = require('../middlewares/authorization');
var errors = require('../middlewares/errors');

module.exports = function(app) {

  app.get('/app/context-search', authorization.requiresLogin, errors.checkHeight, appControllers.contextSearch);
  app.get('/app/documents/:id', authorization.requiresLogin, appControllers.documentDisplay);

};
