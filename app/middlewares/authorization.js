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
      User.findOne({userId: userContext.id}, cb);
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
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
  var organization;

  if (!req.query.data) {
    return next({message: "bad request", status: 401});
  }
  var data = JSON.parse(req.query.data);

  async.waterfall([
    function retrieveCompany(cb) {
      if (!data.organization.id) {
        return next({message: "bad request", status: 401});
      }

      Organization.findOne({organizationId: data.organization.id}, cb);
    },
    function checkRequestValidity(org, cb){
      organization = org;
      if (!org) {
        return next({message: "bad request", status: 401});
      }

      var hash = data.organization.id + data.user.id + org.masterKey + "SalesFetch4TheWin";
      var check = crypto.createHash('sha1').update(hash).digest("base64");

      if (check !== data.hash) {
        return next({message: "bad request", status: 401});
      }

      cb(null, data);
    },
    function loadUser(envelope, cb){
      authenticateUser(envelope, organization, cb);
    }
  ], function (err, user) {
    if (err) {
      return next({status: 401});
    }

    req.user = user;
    req.reqParams = data;

    next();
  });
};
