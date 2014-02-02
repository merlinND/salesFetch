'use strict';

exports.index = function(req, res) {
  res.send(200);
};

exports.authenticate = function(req, res) {
  var bodyArray = req.body.signed_request.split(".");

  console.log(bodyArray);
  res.send(200);
};