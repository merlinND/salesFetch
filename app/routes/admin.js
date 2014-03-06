'use strict';

// Application routes use administration controller
var admin = require('../controllers/admin');
var authorization = require('./middlewares/authorization');

module.exports = function(app) {

  app.get('/admin', authorization.requiresLogin, admin.index);
  app.get('/admin/context-profiler/new', authorization.requiresLogin, admin.newContextProfiler);
  app.post('/admin/context-profiler/', authorization.requiresLogin, admin.createContextProfiler);
  app.get('/admin/context-profiler/:contextProfilerId/edit', authorization.requiresLogin, admin.editContextProfiler);
  app.get('/admin/context-profiler/:contextProfilerId/delete', authorization.requiresLogin, admin.deleteContextProfiler);
};