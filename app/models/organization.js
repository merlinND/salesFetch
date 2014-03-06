'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Organization Schema
 */
var OrgModel = new Schema ({
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

mongoose.model('Organization', OrgModel);
