'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');

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

/**
 * Statics
 */
OrgModel.statics.load = function(id, cb) {
  this.findOne({_id: id}, function(err, company) {
    if (err) {
      return cb(err);
    }

    User.find({company: company._id}, function(err, users) {
      if (err) {
        return cb(err);
      }

      company.users = users;
      cb(null, company);
    });
  });
};


module.exports = mongoose.model('Organization', OrgModel);