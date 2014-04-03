'use strict';

/**
 * Generic logging error middleware
 */

function logErrors(err, req, res, next) {
  req.unhandledError = err;


  var message = err.message;
  var error = err.error || err;
  var status = err.status || 500;

  var page = status + '.html';

  res.render( page, {
    message: message,
    error: error
  });
}

var patchRoute = function  (route) {
  route.callbacks.push(logErrors);
};

module.exports.checkHeight = function(req, res, next) {
  var env = req.reqParams.env;

  if(env && env.deviseType === 'desktop' && (env.height < 400)) {
    return next({message: "The context page need a minimum of 400px height to be displayed.", status: 401});
  }

  next();
};

module.exports.addErrorsPages = function(app) {
  for (var verb in app.routes) {
    var routes = app.routes[verb];
    routes.forEach(patchRoute);
  }
};
