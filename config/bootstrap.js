'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
var lessMiddleware = require('less-middleware');

var config = require('./config.js');
var walk = require('./util.js');

var expressConfig = function(app) {

  // Simplified logger for dev and production
  if (config.nodeEnv !== 'test') {
    app.use(require(config.root + '/app/midlewares/looger.js'));
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

module.exports = function() {

  // Require models
  var modelsPath = config.root + '/app/models';
  walk(modelsPath, function(path) { console.log(path); require(path); });

  // Configure express
  var app = express();
  expressConfig(app);

  // Require routes
  var routesPath = config.root + '/app/routes';
  walk(routesPath, function(path) {
    require(path)(app);
  });

  return app;
};