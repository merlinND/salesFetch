'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
var lessMiddleware = require('less-middleware');
var errorsStack = require('errorhandler');

var config = require('./configuration.js');
var walk = require('./util.js');

var expressConfig = function(app) {

  // Simplified logger for dev and production
  if (config.env !== 'test') {
    app.use(require(config.root + '/app/middlewares/logger.js'));
  }

  // Other middlewares
  app.use(bodyParser());
  app.use(require(config.root + '/app/middlewares/CORS.js'));

  // Less middleware
  var lessPath = config.root + '/assets/less';
  var publicPath = config.root + '/public/stylesheets';
  var bootstrapPath = config.root + '/public/lib/bootstrap/less';
  app.use(lessMiddleware(lessPath, {
    dest: publicPath,
    parser: {
      paths: [bootstrapPath],
    }
  }));

  // Views engine
  swig.setDefaults({
    cache: config.swig.cache
  });
  app.engine('html', swig.renderFile);

  // View directory
  app.set('view engine', 'html');
  app.set('views', config.root + '/app/views');

  // Static files
  app.use(express.static(config.root + '/public'));
};

var errorsHanlders = function(app) {

  // This middleware is used to provide a next
  app.use(function(err, req, res, next) {

    // Treat as 401
    if (err.message.indexOf('unauthorized') !== -1 || err.status === 401) {
      return res.status(err.status).render('401', {
        error: 'Unauthorized',
        message: err.message
      });
    }

    // Treat as 404
    if (err.message.indexOf('not found') !== -1 || err.status === 404) {
      next();
    }

    // Log it
    if (config.env === 'development') {
      console.error(err.stack);
    }

    // Error page
    return res.status(500).render('500', {
        error: err.stack,
        message: err.message
    });
  });

  // Assume 404 since no middleware responded
  app.use(function(req, res) {
    return res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });

  if (config.env === 'development') {
    app.use(errorsStack());
  }
};

module.exports = function() {
  // Check if fetchApi token is set before continuing !
  if (config.env !== 'test' && !config.fetchApiCreds) {
    console.log('Please provide a FetchApi token before launcing the server.');
    process.exit(1);
  }

  // Require models
  var modelsPath = config.root + '/app/models';
  walk(modelsPath, function(path) { require(path); });

  // Configure express
  var app = express();
  expressConfig(app);

  // Require routes
  var routesPath = config.root + '/app/routes';
  walk(routesPath, function(path) {
    require(path)(app);
  });

  // Apply errors if routing fail or not match
  errorsHanlders(app);

  return app;
};