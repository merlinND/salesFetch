'use strict';

/**
 * Login helpers
 */

var async = require('async');
var request = require('supertest');
var agent = request.agent();
var crypto = require('crypto');
var consumerSecret = require('../../config/index').consumer_secret;


var getDefaultPayload = function(parameters) {
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
        parameters: parameters
      }
    },
    client: {
      instanceUrl: 'https://eu2.salesforce.com',
      oauth_token: 'random_token'
    }
  };

  return obj;
};


/**
 * Create an envelope to use for authenticating call
 */
var createAuthHash = function(obj) {
  var encodedContent = new Buffer(JSON.stringify(obj)).toString("base64");
  return crypto.createHmac("sha256", consumerSecret).update(encodedContent).digest("base64");
};


var loginUser = function(app, parameters, done) {
  var obj = getDefaultPayload(parameters);
  var postBody = createAuthHash(obj) + '.' + new Buffer(JSON.stringify(obj)).toString("base64");

  request(app)
    .post('/authenticate')
    .send({signed_request: postBody})
    .expect(302)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      agent.saveCookies(res);
      done(null, res.headers.location, agent);
    });
};


/**
 * Log the user in and return to the callback the user agent for futher calls
 */
var authenticatedCall = function(app, parameters, done) {
  async.waterfall([
    function authenticatedCall(cb) {
      loginUser(app, parameters, cb);
    },
    function buildRealRequest(location, agent, cb) {
      var req = request(app).get(location);
      agent.attachCookies(req);

      cb(null, req);
    }
  ], done);
};


module.exports.getDefaultPayload = getDefaultPayload;
module.exports.createAuthHash = createAuthHash;
module.exports.loginUser = loginUser;
module.exports.authenticatedCall = authenticatedCall;
