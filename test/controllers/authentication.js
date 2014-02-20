'use strict';

var request = require('supertest');
var crypto = require('crypto');
var should = require('should');

var app = require('../../app.js');
var cleaner = require('../hooks/cleaner');
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

describe('<user controller>', function() {
  beforeEach(function(done) {
    cleaner(done);
  });

  describe('/authenticate endpoint', function() {

    it('reject unidentified user', function(done) {
      request(app)
        .post('/authenticate')
        .expect(401, done);
    });

    it('authenticate user with valide credentials', function(done) {
      var postBody = createAuthHash(obj) + '.' + new Buffer(JSON.stringify(obj)).toString("base64");

      request(app)
        .post('/authenticate')
        .send({signed_request: postBody})
        .expect(302, function(err, res) {
          res.should.have.header('set-cookie');
          res.headers['set-cookie'][0].should.match(/connect.sid/);
          done();
        });
    });

    it('redirect to search path', function(done) {
      var postBody = createAuthHash(obj) + '.' + new Buffer(JSON.stringify(obj)).toString("base64");

      request(app)
        .post('/authenticate')
        .send({signed_request: postBody})
        .expect(302, function(err, res) {
          res.headers.location.should.include('/app/search');
          done();
        });
    });

    it('redirect to the context path', function(done) {
      var contextObj = obj;
      contextObj.context.environment.parameters.mode = 'context';
      var postBody = createAuthHash(contextObj) + '.' + new Buffer(JSON.stringify(contextObj)).toString("base64");

      request(app)
        .post('/authenticate')
        .send({signed_request: postBody})
        .expect(302, function(err, res) {
          res.headers.location.should.include('/app/context');
          done();
        });
    });
  });
});