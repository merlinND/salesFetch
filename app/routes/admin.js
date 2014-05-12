'use strict';

// Application routes use administration controller
var admin = require('../controllers/admin');
var authorization = require('../middlewares/authorization');

module.exports = function(app) {

  app.get('/admin', authorization.requiresLogin, admin.index);
  app.post('/admin/init', admin.init);
};
