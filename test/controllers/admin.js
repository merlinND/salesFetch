'use strict';

require("should");

var async = require('async');
var request = require('supertest');
var app = require('../../app.js');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Organization = mongoose.model('Organization');


var APIs = require('../helpers/APIs');
var cleaner = require('../hooks/cleaner');
var checkUnauthenticated = require('../helpers/access').checkUnauthenticated;

describe('<Admin controller>', function() {
  beforeEach(cleaner);
  beforeEach(function(done) {
    APIs.mount('fetchAPI', 'http://api.anyfetch.com', done);
  });

  describe('GET /admin page', function() {
    var endpoint = '/admin';

    checkUnauthenticated(app, 'get', endpoint);
  });

  describe('POST /admin/init', function() {
    var endpoint = '/admin/init';

    it.only('should create a user and a company', function(done) {
      // Mock send from Salesforce
      var SFDCinfos = {
        user: {
          name: 'Jessy Pinkman',
          id: '5678',
          email: 'jessy.pinkman@breaking-bad.com'
        },
        organization: {
          name: 'Breaking Bad',
          id: '1234'
        }
      };

      var generatedMasterKey;

      // Validation
      var validates = [
        function checkCompany(cb) {
          Organization.find({}, function(err, orgs) {
            orgs.length.should.eql(1);

            var o = orgs[0];
            o.name.should.eql('Breaking Bad');
            o.SFDCId.should.eql('1234');
            o.anyFetchId.should.eql('533d9161162215a5375d34d2');
            generatedMasterKey = o.masterKey;

            cb(null, o);
          });
        },
        function checkUser(org, cb) {
          User.find({}, function(err, users) {
            users.length.should.eql(1);

            var u = users[0];
            u.name.should.eql('Jessy Pinkman');
            u.SFDCId.should.eql('5678');
            u.anyFetchId.should.eql('533d6b2a6355285e5563d005');
            u.email.should.eql('jessy.pinkman@breaking-bad.com');
            u.organization.should.eql(org._id);

            cb(null);
          });
        }
      ];

      // Fake request
      request(app)
        .post(endpoint)
        .send(SFDCinfos)
        .expect(200)
        .end(function(err, res) {
          async.waterfall(validates, function() {

            res.text.should.eql(generatedMasterKey);
            done();
          });
        });
    });
  });
});
