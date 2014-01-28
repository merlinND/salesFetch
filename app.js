'use strict';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.mongo_url);
var app = express();

// Views settings
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Logger configuration
app.use(express.logger('dev'));

// serve static files
app.use(express.static(__dirname + '/public'));

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