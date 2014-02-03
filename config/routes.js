/**
 * Application routing
 */

'use strict';

module.exports = function (app, controllers) {
  // Website routing
  app.get('/', controllers.website);

  // Canvas application routing
  app.get('/authenticate', controllers.canvas);
};