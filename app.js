'use strict';
/**
 * Salesfetch application
 */

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var controllers = require('./app/controllers.js');

/**
 * Application configuration
 */


// Connect mongo
mongoose.connect(config.mongo_url);

// Configure server
var app = express();
config.bootstrap(app, mongoose);

// Routing
require('./config/routes.js')(app, controllers);

var server;
if (config.env === 'development') {
  // Create https server for dev with SSL
  server = require('https').createServer(config.certif, app).listen(config.port, function() {
    console.log("Server HTPPS [" + config.env + "] listening on " + config.port);
  });
} else {
  // Delegate SSL to Heroku for production
  server = require('http').createServer(app).listen(config.port, function() {
    console.log("Server HTTP [" + config.env + "] listening on " + config.port);
  });
}

module.exports = server;