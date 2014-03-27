'use strict';

/**
 * Generic logging error middleware
 */

function logErrors(err, req, res, next) {
  req.unhandledError = err;

  var message = err.message;
  var error = err.error || err;
  var status = err.status || 500;

  res.json({message: message, error: error}, status);
}

var patchRoute = function  (route) {
  route.callbacks.push(logErrors);
};

module.exports = function(app) {
  for (var verb in app.routes) {
    var routes = app.routes[verb];
    routes.forEach(patchRoute);
  }
};