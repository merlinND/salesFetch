'use strict';

var mochaMongoose = require('mocha-mongoose');
var config = require('../../config/config.js');

module.exports = mochaMongoose(config.mongo_url, {noClear: true});