'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserModel = new Schema ({
  created: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    unique: true
  },
  organization: {
    type: Schema.ObjectId,
    ref: 'Organization'
  },
  name: String,
  email: String
});

mongoose.model('User', UserModel);
