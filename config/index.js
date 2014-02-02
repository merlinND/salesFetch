var path = require('path');

// node_env can either be "development", "production" or "test"
var node_env = process.env.NODE_ENV || "development";

// port of running application
var default_port = 8000;
if (node_env === "production") {
  default_port = 80;
}

// Root path of the server
var root_path = path.normalize(__dirname + '/..');

// mongo url connection
var default_mongo_url = "mongodb://localhost/" + node_env;

// Salesfetch configuration
if (!process.env.CONSUMER_KEY || !process.env.CONSUMER_SECRET) {
  console.log('[ERROR] CONSUMER_KEY or CONSUMER_SECRET is missing.');
  process.exit(1);
}

module.exports = {
  env: node_env,
  root_path: root_path,
  port: process.env.PORT || default_port,
  mongo_url: process.env.MONGO_URL || default_mongo_url,

  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET
};