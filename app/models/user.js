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
  company: {
    type: Schema.ObjectId,
    ref: 'Company'
  },
  name: String,
  email: String
});

/**
 * Statics
 */
UserModel.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('company').exec(cb);
};

mongoose.model('User', UserModel);