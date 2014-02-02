'use strict';

var crypto = require("crypto");
var config = require('../config');
var User = require('../models/user');

var authenticateUser = function(context, cb) {
  User.findOne({userId: context.userId}, function(err, user) {
    if (err) {
      return cb(err);
    }

    if (user) {
      cb(null, user);
    } else {
      user = new User({
        name: context.fullName,
        userId: context.userId,
        email: context.email
      });

      user.save(cb);
    }

  });
};

exports.index = function(req, res) {
  if (req.user) {
    res.send("On the index and connected with " + req.user.name);
  } else {
    res.send("On the index");
  }
};

exports.authenticate = function(req, res) {
  var bodyArray = req.body.signed_request.split(".");
  var consumerSecret = bodyArray[0];
  var encodedEnvelope = bodyArray[1];

  // Check the request validity
  var check = crypto.createHmac("sha256", config.consumer_secret).update(encodedEnvelope).digest("base64");
  if (check === consumerSecret) {
    var envelope = JSON.parse(new Buffer(encodedEnvelope, "base64"));

    authenticateUser(envelope.context.user, function(err, user) {
      if (err) {
        return res.send(500, {error: 'Problem during retrieving user'});
      }

      req.user = user;
      req.context = envelope.context;

      res.send(200, user);
    });


  } else {
    res.send(401);
  }
};