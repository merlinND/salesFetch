'use strict';

var crypto = require('crypto');
var async = require('async');
var mongoose =require('mongoose');
var Organization = mongoose.model('Organization');
var User = mongoose.model('User');


/**
 * Authenticate the user based on the request's context
 * return the user
 */
var authenticateUser = function(context, org, done) {
  var userContext = context.user;
  async.waterfall([
    function(cb) {
      // Find an existing user
      User.findOne({userId: userContext.userId}, cb);
    }, function(user, cb) {
      if (user) {
        return done(null, user);
      }

      // Create create a user in the company
      var newUser = new User({
        name: userContext.name,
        userId: userContext.id,
        email: userContext.email,
        organization: org._id
      });
      newUser.save(cb);
    }
  ], done);
};


/**
 * Called by Salesforce with SF user credentials and current context.
 * We'll use this to find our user / create an user.
 */
module.exports.authenticate = function(req, res, next) {
  var organization;

  async.waterfall([
    function retrieveCompany(cb) {
      if (!req.body.org.id) {
        return next({message: "bad request", status: 401});
      }

      Organization.findOne({organizationId: req.body.org.id}, cb);
    },
    function checkRequestValidity(org, cb){
      organization = org;
      var hash = req.body.org.id + req.body.user.id + "Bob" + "SalesFetch4TheWin";

      // Check the request validity
      var check = crypto.createHash('sha1').update(hash).digest("base64");
      if (check !== req.body.hash) {
        return next({message: "bad request", status: 401});
      }

      cb(null, req.body);
    },
    function loadUser(envelope, cb){
      authenticateUser(envelope, organization, cb);
    }
  ], function (err, user) {
    if (err) {
      return res.send(401);
    }

    var redirectUrl = req.body['redirect-url'];

    req.session.user = user;
    req.session.oauthToken = req.body['session-id'];

    redirectUrl += "?context=" + encodeURIComponent(JSON.stringify(req.body));

    return res.redirect(302, redirectUrl);
  });
};
