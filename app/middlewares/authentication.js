/*
 * Canvas authentication middleware
 */

'use strict';

var crypto = require("crypto");
var config = require('../../config');
var User = require('../models/user');
var Organization = require('../models/organization');

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

        if (!org) {
          console.log("no organisation found");
          return cb('no organization');
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


module.exports = function(req, res, next) {
  // Handle the post request
  if (req.method === 'POST' && req.url === '/authenticate') {

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
          return res.send(500, {error: 'Problem during retrieving user'});
        }

        req.session.user = user;
        req.session.context = envelope.context;
        return next();
      });
    } else {
      res.send(401);
    }
  } else if(req.session.user) {
    User.findOne(req.session.user._id, function(err, user) {
      req.session.user = user;
      return next();
    });
  } else {
    res.send(401);
  }
};