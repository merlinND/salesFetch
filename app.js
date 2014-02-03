'use strict';
/**
 * Salesfetch application
 */

var express = require('express');
var https = require('https');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config');

/**
 * Application configuration
 */

// Get SSL certificates
var options = {
  key: fs.readFileSync('ssl-key.pem'),
  cert: fs.readFileSync('ssl-cert.pem')
};

// Connect mongo
mongoose.connect(config.mongo_url);

// Configure server
var app = express();
config.bootstrap(app);



// Create server
https.createServer(options, app).listen(config.port, function() {
  console.log("Server listening on " + config.port);
});