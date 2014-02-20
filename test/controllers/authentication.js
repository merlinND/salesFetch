'use strict';

var request = require('supertest');
var crypto = require('crypto');

var app = require('../../app.js');

var createAuthHash = function(obj) {
  var encodedContent = new Buffer(JSON.stringify(obj)).toString("base64");
  return crypto.createHmac("sha256", "2568115552151233568").update(encodedContent).digest("base64");
};

describe('<user controller>', function() {
  describe('/authenticate endpoint', function() {

    it('reject unidentified user', function(done) {
      request(app)
        .post('/authenticate')
        .expect(401, done);
    });

    it('authenticate user with valide credentials', function(done) {
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
      var postBody = createAuthHash(obj) + '.' + new Buffer(JSON.stringify(obj)).toString("base64");

      request(app)
        .post('/authenticate')
        .send({signed_request: postBody})
        .expect(302, done);
    });
  });
});