'use strict';

require("should");
var async = require('async');
var request = require('supertest');
var mongoose = require('mongoose');
var crypto = require('crypto');
var User = mongoose.model('User');
var Organization = mongoose.model('Organization');

var app = require('../../app.js');
var cleaner = require('../hooks/cleaner');

describe('<Authentication middleware>', function() {
  var endpoint = '/app/context-search';

  beforeEach(cleaner);

  it('should reject empty calls', function(done) {
    request(app)
      .get(endpoint)
      .expect(401)
      .end(done);
  });

  it.skip('should accept call', function(done) {
    var createdOrg;

    async.waterfall([
      function createCompany(cb) {
        var org = new Organization({
          name: "anyFetch",
          organizationId: '1234'
        });
        org.save(cb);
      }, function createUser(org, count, cb) {
        createdOrg = org;

        var user = new User({
          userId: '5678',
          organization: org
        });
        user.save(cb);
      }, function makeCall(user, count, cb) {
        var hash = createdOrg.organizationId + user.userId + createdOrg.masterKey + "SalesFetch4TheWin";
        hash = crypto.createHash('sha1').update(hash).digest("base64");

        var authObj = {
          hash: hash,
          organization: {id: createdOrg.organizationId},
          user: {id: user.userId}
        };

        endpoint += '?data=' + encodeURIComponent(JSON.stringify(authObj));

        request(app)
          .get(endpoint)
          .expect(500)
          .end(function(e,d) {
            cb();
          });
      }
    ], done);
  });
});
