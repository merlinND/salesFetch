'use strict';

// Application routes use applications controller
var applications = require('../controllers/app');
var authorization = require('./middlewares/authorization');

module.exports = function(app) {

  app.get('/app/search', authorization.requiresLogin, applications.search);
  app.get('/app/context', authorization.requiresLogin, applications.context);
  app.get('/app/document/:documentId', authorization.requiresLogin, applications.show);

  // Finish with setting up the documentId param
  app.param('documentId', applications.document);

};