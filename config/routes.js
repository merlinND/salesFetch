/**
 * Application routing
 */

'use strict';

var auth = require('../app/middlewares/authentication.js');


module.exports = function (app, controllers) {
  // Website routing
  app.get('/', controllers.website);

  // Canvas application routing
  app.get('/canvas', auth, controllers.canvas);
  app.get('/canvas/:id', auth, controllers.canvas);
  app.post('/authenticate', auth, controllers.canvas);
};