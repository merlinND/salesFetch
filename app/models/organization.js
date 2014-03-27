'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

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
  currency: String,
  masterKey: String
});

/**
 * Pre-save hook
 */
OrgModel.pre('save', function(next) {

  if (!this.isNew) {
    return next();
  }

  this.masterKey = crypto.randomBytes(20).toString('hex');
  return next();
});

mongoose.model('Organization', OrgModel);
