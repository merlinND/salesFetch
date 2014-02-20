'use strict';
/**
 * Salesfetch application
 */

var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config');

/**
 * Application configuration
 */


// Connect mongo
mongoose.connect(config.mongo_url);

// Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      require(newPath);
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(models_path);


// Configure server
var app = express();
config.bootstrap(app, mongoose);

// Bootstrap routes
var routes_path = __dirname + '/app/routes';
var walk = function(path) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      require(newPath)(app);
    // We skip the app/routes/middlewares directory as it is meant to be
    // used and shared by routes as further middlewares and is not a
    // route by itself
    } else if (stat.isDirectory() && file !== 'middlewares') {
      walk(newPath);
    }
  });
};
walk(routes_path);


// Start server
var server;
if (config.env === 'development') {
  // Create https server for dev with SSL
  server = require('https').createServer(config.certif, app).listen(config.port, function() {
    console.log("Server HTTPS [" + config.env + "] listening on " + config.port);
  });
} else {
  // Delegate SSL to Heroku for production
  server = require('http').createServer(app).listen(config.port, function() {
    console.log("Server HTTP [" + config.env + "] listening on " + config.port);
  });
}

module.exports = server;