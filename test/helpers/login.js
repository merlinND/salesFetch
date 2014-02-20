'use strict';

var request = require('supertest');
var user = request.agent();
var crypto = require('crypto');
var consumerSecret = require('../../config/index').consumer_secret;

var createAuthHash = function(obj) {
  var encodedContent = new Buffer(JSON.stringify(obj)).toString("base64");
  return crypto.createHmac("sha256", consumerSecret).update(encodedContent).digest("base64");
};

var obj = {
  context: {
    user: {
      userId: 'userId',
      fullName: 'Walter White',
      email: 'walter.white@breakingbad.com'
    },
    organization: {
      organizationId: 'companyId'
    },
    environment: {
      parameters: {
        mode: 'search'
      }
    }
  }
};

module.exports = function(request, done) {
  var postBody = createAuthHash(obj) + '.' + new Buffer(JSON.stringify(obj)).toString("base64");

  request
    .post('/authenticate')
    .send({signed_request: postBody})
    .end(function(err, res) {
      if (err) {
        throw err;
      }

      user.saveCookie(res);
      done(user);
    });
};