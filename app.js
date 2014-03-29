'use strict';
/**
 * Salesfetch application
 */

var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config');

// Require all files in specified directory
var walk = function(path, fileCb) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      fileCb(newPath);
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};

// Connect mongo
mongoose.connect(config.mongo_url);

// Bootstrap models
var modelsPath = __dirname + '/app/models';
walk(modelsPath, function(path) { require(path); });


// Configure server
var app = express();
config.bootstrap(app);

// Bootstrap routes
var routesPath = __dirname + '/app/routes';
walk(routesPath, function(path) { require(path)(app); });

// Error Handeling
require('./app/middlewares/errors')(app);


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
