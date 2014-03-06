'use strict';

// Application routes use applications controller
var applications = require('../controllers/app');
var authorization = require('../middlewares/authorization');

module.exports = function(app) {

  app.get('/app/search', authorization.requiresLogin, applications.search);
  app.get('/app/context', authorization.requiresLogin, applications.context);
  app.get('/app/documents/:documentId', authorization.requiresLogin, applications.show);

};
