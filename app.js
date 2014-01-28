'use strict';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.mongo_url);

var app = express();


// Views settings
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.send('Hello World');
});

module.exports = app;