'use strict';
/**
 * Salesfetch configuration an server bootstrap
 */


var express = require('express');
var swig = require('swig');
var fs = require('fs');

/**
 * Constant settings
 */

// node_env can either be "development", "production" or "test"
var node_env = process.env.NODE_ENV || "development";

// port of running application
var default_port = 8000;
if (node_env === "production") {
  default_port = 80;
}

// mongo url connection
var mongo_url = process.env.MONGO_URL || "mongodb://localhost/salesfetch_" + node_env;

// directory path
var dir_path = (__dirname + '/..');

// Certification
var certificates = {
  key: fs.readFileSync(dir_path + '/config/ssl-key.pem'),
  cert: fs.readFileSync(dir_path + '/config/ssl-cert.pem')
};

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

/**
 * Server bootstrap
 */
var bootstrapServer = function(app) {

  // Sessions
  app.use(allowCrossDomain);
  app.use(express.cookieParser());

  // Use less
  app.use(require('less-middleware')({
    dest: dir_path + '/public/stylesheets',
    src: dir_path + '/assets/less',
    prefix: '/stylesheets',
    paths: [dir_path + '/public/lib/bootstrap/less'],
    compress: true
  }));

  // Views engine
  swig.setDefaults({
    cache: node_env !== 'production' ? false : 'memory'
  });
  app.engine('html', swig.renderFile);

  // View dir
  app.set('view engine', 'html');
  app.set('views', dir_path + '/app/views');

  // Use
  app.use(express.urlencoded());
  app.use(express.json());
  if (node_env === 'development') {
    app.use(express.logger());
  }

  // Static
  app.use(express.static(dir_path + '/public'));
};


module.exports = {
  env: node_env,
  port: process.env.PORT || default_port,
  mongo_url: mongo_url,
  certif: certificates,

  bootstrap: bootstrapServer
};
