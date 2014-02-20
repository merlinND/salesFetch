'use strict';

// User routes use users controller
var users = require('../controllers/users');

module.exports = function(app) {

  // Authentication from salesforce
  app.post('/authenticate', users.authenticate);

};