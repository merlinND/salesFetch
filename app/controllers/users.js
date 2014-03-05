'use strict';

var crypto = require('crypto');
var async = require('async');
var mongoose =require('mongoose'),
    Organization = mongoose.model('Organization'),
    User = mongoose.model('User');
var config = require('../../config');


/**
 * Authenticate the user based on the request's context
 * return the the
 */
var authenticateUser = function(context, callback) {
  var userContext = context.user;
  var orgContext = context.organization;
  async.waterfall([
    function(cb) {
      // Find an existing user
      User.findOne({userId: userContext.userId}, cb);
    }, function(user, cb) {
      if (user) {
        return callback(null, user);
      }

      // Find the a mathcing company
      Organization.findOne({organizationId: context.organization.organizationId}, cb);
    }, function(org, cb) {
      if (org) {
        return cb(null, org);
      }

      console.log(orgContext);

      // Create a comapny if no one matching
      var  newOrg = new Organization({
        name: orgContext.name,
        organizationId: orgContext.organizationId,
        currency: orgContext.currencyIsoCode
      });
      newOrg.save(cb);
    }, function(org, cb) {
      // Create create a user in the company
      var user = new User({
        name: userContext.fullName,
        userId: userContext.userId,
        email: userContext.email,
        organization: org._id
      });

      user.save(cb);
    }
  ], callback);
};

/**
 * Choose the right redirection url based on the authentication
 * context.
 */
var redirectionOnContext = function(context) {
  var mode = context.environment.parameters.mode;

  if(mode === "search") {
    return '/app/search';
  } else {
    return '/app/context';
  }
};

/**
 * Authenticate the selected user
 */
module.exports.authenticate = function(req, res) {
  var envelope;

  async.waterfall([
    function(cb){
      if (!req.body.signed_request) {
        return cb('bad request');
      }

      // Extract request parts
      var bodyArray = req.body.signed_request.split(".");
      var consumerSecret = bodyArray[0];
      var encodedEnvelope = bodyArray[1];

      // Check the request validity
      var check = crypto.createHmac("sha256", config.consumer_secret).update(encodedEnvelope).digest("base64");
      if (check !== consumerSecret) {
        return cb('bad request');
      }

      envelope = JSON.parse(new Buffer(encodedEnvelope, "base64"));
      cb(null, envelope);
    },
    function(envelope, cb){
      // Get the user
      authenticateUser(envelope.context, cb);
    }
  ], function (err, user) {
    if (err) {
      return res.send(401);
    }

    req.session.user = user;

    // Add the instance Url for further process
    envelope.context.instance_url = envelope.client.instanceUrl;
    envelope.context.oauth_token = envelope.client.oauthToken;
    req.session.context = envelope.context;

    var redirectUrl = redirectionOnContext(envelope.context);
    return res.redirect(302,redirectUrl);
  });
};