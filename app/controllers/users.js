'use strict';

var crypto = require('crypto');
var async = require('async');
var mongoose =require('mongoose');
var Organization = mongoose.model('Organization');
var User = mongoose.model('User');
var config = require('../../config');


/**
 * Authenticate the user based on the request's context
 * return the user
 */
var authenticateUser = function(context, cb) {
  var userContext = context.user;
  //TODO: waterfall
  User.findOne({userId: userContext.userId}, function(err, user) {
    if (err) {
      return cb(err);
    }

    if (user) {
      cb(null, user);
    } else {
      Organization.findOne({organizationId: context.organization.organizationId}, function(err, org) {
        if (err) {
          return cb(err);
        }

        user = new User({
          name: userContext.fullName,
          userId: userContext.userId,
          email: userContext.email
        });

        return user.save(cb);
      });
    }

  });
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

module.exports.authenticate = function(req, res) {
  var envelope;

  async.waterfall([
    function(cb){
      if (!req.body.signed_request) {
        return cb(new Error('bad request'));
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
    req.session.context = envelope.context;

    var redirectUrl = redirectionOnContext(envelope.context);
    return res.redirect(302, redirectUrl);
  });
};
