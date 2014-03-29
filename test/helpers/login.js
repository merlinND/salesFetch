'use strict';

/**
 * Login helpers
 */

var async = require('async');
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Organization = mongoose.model('Organization');


module.exports.requestBuilder = function (endpoint, context, cb) {
  var createdOrg;

  async.waterfall([
    function createCompany(cb) {
      var org = new Organization({
        name: "anyFetch",
        organizationId: '1234'
      });

      org.save(cb);
    }, function createUser(org, _, cb) {
      createdOrg = org;

      var user = new User({
        userId: '5678',
        name: 'Walter White',
        email: 'walter.white@breaking-bad.com',
        organization: org.id
      });

      user.save(cb);
    }
  ], function(err, user) {
    if (err) {
      return cb(err);
    }

    var hash = createdOrg.organizationId + user.userId + createdOrg.masterKey + "SalesFetch4TheWin";
    hash = crypto.createHash('sha1').update(hash).digest("base64");

    var authObj = {
      hash: hash,
      organization: {id: createdOrg.organizationId},
      user: {id: user.userId},
      context: context,
      anyFetchURL: 'http://api.anyfetch.com'
    };

    var ret = endpoint + '?data=' + encodeURIComponent(JSON.stringify(authObj));
    cb(null, ret);
  });
};