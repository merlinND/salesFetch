'use strict';

var crypto = require("crypto");
var config = require('../../config');
var mongoose =require('mongoose'),
    Organization = mongoose.model('Organization'),
    User = mongoose.model('User');

/**
 * Authenticate the user based on the request's context
 * return the the
 */
var authenticateUser = function(context, cb) {
  var userContext = context.user;
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
          email: userContext.email,
          company: org._id
        });

        user.save(cb);

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
  // Handle the post request
  if (req.method === 'POST' && req.url === '/authenticate') {

    if (!req.body.signed_request) {
      return res.send(401);
    }

    // Extract request parts
    var bodyArray = req.body.signed_request.split(".");
    var consumerSecret = bodyArray[0];
    var encodedEnvelope = bodyArray[1];

    // Check the request validity
    var check = crypto.createHmac("sha256", config.consumer_secret).update(encodedEnvelope).digest("base64");
    if (check === consumerSecret) {
      var envelope = JSON.parse(new Buffer(encodedEnvelope, "base64"));

      authenticateUser(envelope.context, function(err, user) {
        if (err) {
          return res.send(500, err);
        }

        req.session.user = user;
        req.session.context = envelope.context;

        return res.redirect(redirectionOnContext(envelope.context));
      });
    }
  }

  return res.send(401);
};