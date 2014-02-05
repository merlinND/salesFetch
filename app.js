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

if (config.env !== 'production') {
  // Create https server for local dev and testing
  var options = {
    key: fs.readFileSync('ssl-key.pem'),
    cert: fs.readFileSync('ssl-cert.pem')
  };

  require('https').createServer(options, app).listen(config.port, function() {
    console.log("Server [" + config.env + "] listening on " + config.port);
  });
} else {
  // Delegate SSL to Heroku for production
  require('http').createServer(app).listen(config.port, function() {
    console.log("Server [" + config.env + "] listening on " + config.port);
  });
}