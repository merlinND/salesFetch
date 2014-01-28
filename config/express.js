'use strict';

var express = require('express');
var lessMiddleware = require('less-middleware');

var config = require('./index');

module.exports = function(app) {
  // serve static files
  app.use(express.static(config.root_path + '/public'));

  // Views settings
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.set('views', config.root_path + '/views');

  // Logger configuration
  app.use(express.logger('dev'));

  // less precompile
  app.use(lessMiddleware({
    dest: config.root_path + '/public/stylesheets',
    src: config.root_path + '/src/less',
    prefix: '/stylesheets',
    compress: true
  }));
};