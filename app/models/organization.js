'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Organization Schema
 */

var orgModel = new Schema ({
  organizationId: {type: String, required: true, unique: true},
  name: String,
  currency: String
});

module.exports = mongoose.model('Organization', orgModel);