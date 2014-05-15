"use strict";

var _ = require('lodash');

// Load configurations
// Set the node environment variable if not set before
var nodeEnv = process.env.NODE_ENV || 'development';

// Extend the base configuration in all.js with environment
// specific configuration
module.exports = _.extend(
    {nodeEnv: nodeEnv},
    require('./env/all'),
    require('./env/' + nodeEnv) || {}
);