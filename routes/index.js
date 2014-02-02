'use strict';

var crypto = require("crypto");
var config = require('../config');

exports.index = function(req, res) {
  res.send(200);
};

exports.authenticate = function(req, res) {
  var bodyArray = req.body.signed_request.split(".");
  var consumerSecret = bodyArray[0];
  var encodedEnvelope = bodyArray[1];

  var check = crypto.createHmac("sha256", config.consumer_secret).update(encodedEnvelope).digest("base64");
  if (check === consumerSecret) {
    var envelope = JSON.parse(new Buffer(encodedEnvelope, "base64"));
    req.user = envelope.context.user;
    console.log(envelope);
  } else {
    res.send(401);
  }
};