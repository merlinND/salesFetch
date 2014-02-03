'use strict';
/**
 * Salesfetch configuration an server bootstrap
 */


var express = require('express');
var ECT = require('ect');

/**
 * Constant settings
 */

// node_env can either be "development", "production" or "test"
var node_env = process.env.NODE_ENV || "development";

// port of running application
var default_port = 8000;
if (node_env === "production") {
  default_port = 80;
}

// mongo url connection
var default_mongo_url = "mongodb://localhost/salesfetch_" + node_env;

// directory path
var dir_path = (__dirname + '/..');

// Salesfetch configuration
if (!process.env.CONSUMER_KEY || !process.env.CONSUMER_SECRET) {
  console.log('[ERROR] CONSUMER_KEY or CONSUMER_SECRET is missing.');
  process.exit(1);
}

/**
 * Server bootstrap
 */
var bootstrapServer = function(app) {

  // Views engine
  var ectRenderer = ECT({ watch: true, root: dir_path + '/app/views' });
  app.engine('.ect', ectRenderer.render);

  // View dir
  app.set('views', dir_path + '/app/views');

  // Use less
  app.use(require( 'less-middleware' )({ src: dir_path + '/public/' } ) );

  // Static
  app.use(express.static(dir_path + '/public'));
};


module.exports = {
  env: node_env,
  port: process.env.PORT || default_port,
  mongo_url: process.env.MONGO_URL || default_mongo_url,

  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,

  bootstrap: bootstrapServer
};