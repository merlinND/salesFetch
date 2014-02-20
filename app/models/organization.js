'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Organization Schema
 */
var orgModel = new Schema ({
  created: {
    type: Date,
    default: Date.now
  },
  organizationId: {
    type: String,
    unique: true
  },
  name: String,
  currency: String
});

module.exports = mongoose.model('Organization', orgModel);