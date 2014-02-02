'use strict';

var express = require('express');
var https = require('https');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config');
var express_configuration = require('./config/express');
var routes = require('./routes');

var options = {
  key: fs.readFileSync('ssl-key.pem'),
  cert: fs.readFileSync('ssl-cert.pem')
};

mongoose.connect(config.mongo_url);

// Create and configure the express application
var app = express();
express_configuration(app);

// Routings
app.get('/', routes.index);
app.post('/authenticate', routes.authenticate);

https.createServer(options, app).listen(config.port, function() {
  console.log("Server listening on " + config.port);
});