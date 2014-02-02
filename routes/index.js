'use strict';

var crypto = require("crypto");
var config = require('../config');
var User = require('../models/user');

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

    var contextUser = envelope.context.user;

    User.findOne({userId: contextUser.userId}, function(err, user) {
      if (err) {
        return res.send(500, { error: 'something blew up' });
      }

      if (!user) {
        console.log("New user connection");
        user = new User({
          name: contextUser.fullName,
          userId: contextUser.userId,
          email: contextUser.email
        }).save();
      }

      req.user = user;
      exports.index(req, res);
    });
  } else {
    res.send(401);
  }
};