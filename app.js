'use strict';
/**
 * Salesfetch application
 */

var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
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
if (config.env !== 'production' && config.env !== 'test') {
  // Create https server for local dev and testing
  var options = {
    key: fs.readFileSync('ssl-key.pem'),
    cert: fs.readFileSync('ssl-cert.pem')
  };

  server = require('https').createServer(options, app).listen(config.port, function() {
    console.log("Server HTPPS [" + config.env + "] listening on " + config.port);
  });
} else {
  // Delegate SSL to Heroku for production
  server = require('http').createServer(app).listen(config.port, function() {
    console.log("Server HTTP [" + config.env + "] listening on " + config.port);
  });
}

module.exports = server;