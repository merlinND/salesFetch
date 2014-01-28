'use strict';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var express_configuration = require('./config/express');

mongoose.connect(config.mongo_url);

// Create and configure the express application
var app = express();
express_configuration(app);

// Dummy users
var users = [
  { name: 'tobi', email: 'tobi@learnboost.com' },
  { name: 'loki', email: 'loki@learnboost.com' },
  { name: 'jane', email: 'jane@learnboost.com' }
];


app.get('/', function(req, res){
  res.render('users', {
    users: users,
    title: "EJS example",
    header: "Some users"
  });
});

module.exports = app;