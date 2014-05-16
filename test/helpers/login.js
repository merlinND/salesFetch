'use strict';

/**
 * Login helpers
 */

var async = require('async');
var crypto = require('crypto');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Organization = mongoose.model('Organization');


module.exports.requestBuilder = function (endpoint, context, env, cb) {
  var createdOrg;

  async.waterfall([
    function createCompany(cb) {
      var org = new Organization({
        name: 'Breaking Bad',
        anyFetchId: 'anyFetchId',
        SFDCId: 'SFDCId',
      });

      org.save(cb);
    }, function createUser(org, _, cb) {
      createdOrg = org;

      var user = new User({
        anyFetchId: 'anyFetchId',
        SFDCId: 'SFDCId',
        name: 'Walter White',
        email: 'walter.white@breaking-bad.com',
        anyFetchToken: 'anyFetchToken',
        organization: org._id,
        isAdmin: true
      });

      user.save(cb);
    }
  ], function(err, user) {
    if (err) {
      return cb(err);
    }

    var hash = createdOrg.SFDCId + user.SFDCId + createdOrg.masterKey + "SalesFetch4TheWin";
    hash = crypto.createHash('sha1').update(hash).digest("base64");

    var contextEnv = env || {
      deviseType: 'desktop',
      height: 500,
      width: 500
    };

    var authObj = {
      hash: hash,
      env: contextEnv,
      organization: {id: createdOrg.SFDCId},
      user: {id: user.SFDCId},
      context: context,
      anyFetchURL: 'http://api.anyfetch.com',
      instanceURL: 'https://eu2.salesforce.com'
    };

    var separator = endpoint.indexOf('?') !== -1 ? '&' : '?';

    var ret = endpoint + separator + 'data=' + encodeURIComponent(JSON.stringify(authObj));
    cb(null, ret);
  });
};
