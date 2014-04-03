'use strict';

require("should");

var async = require('async');
var request = require('supertest');

var app = require('../../app.js');
var cleaner = require('../hooks/cleaner');
var requestBuilder = require('../helpers/login').requestBuilder;
var APIs = require('../helpers/APIs');
var checkUnauthenticated = require('../helpers/access').checkUnauthenticated;

describe('<Admin controller>', function() {
  beforeEach(cleaner);
  beforeEach(function(done) {
    APIs.mount('salesforce', 'https://eu2.salesforce.com', done);
  });

  describe('GET /admin page', function() {
    var endpoint = '/admin';

    checkUnauthenticated(app, 'get', endpoint);

    it("should render all context profilers", function(done) {

      async.waterfall([
        function buildRequest(cb) {
          requestBuilder(endpoint, null, null, cb);
        },
        function sendRequest(url, cb) {
          request(app)
            .get(url)
            .expect(200)
            .expect(function(res) {
              res.text.should.containDeep("Contact");
            })
            .end(cb);
        }
      ], done);
    });
  });

  describe('GET /admincontext-profiler/create page', function() {
    var endpoint = '/admin/context-profiler/new';

    checkUnauthenticated(app, 'get', endpoint);

    it("should render all not existing context profiler", function(done) {

      async.waterfall([
        function buildRequest(cb) {
          requestBuilder(endpoint, null, null, cb);
        },
        function sendRequest(url, cb) {
          request(app)
            .get(url)
            .expect(200)
            .expect(function(res) {
              res.text.should.containDeep("Account");
              res.text.should.containDeep("Lead");
              res.text.should.not.containDeep("Contact");
            })
            .end(cb);
        }
      ], done);
    });
  });

  describe('GET /admin/context-profiler/:id/delete page', function() {
    var endpoint = '/admin/context-profiler/005b000000167GlAAI/delete';

    checkUnauthenticated(app, 'get', endpoint);

    it("should render all not existing context profiler", function(done) {

      async.waterfall([
        function buildRequest(cb) {
          requestBuilder(endpoint, null, null, cb);
        },
        function sendRequest(url, cb) {
          request(app)
            .get(url)
            .expect(302)
            .expect(function(res) {
              res.header.location.should.startWith('/admin');
            })
            .end(cb);
        }
      ], done);
    });
  });

  describe('POST /admin/context-profiler/', function() {
    var endpoint = '/admin/context-profiler/';

    checkUnauthenticated(app, 'post', endpoint);

    it.skip("should render all not existing context profiler", function(done) {

      async.waterfall([
        function buildRequest(cb) {
          requestBuilder(endpoint, null, null, cb);
        },
        function sendRequest(url, cb) {
          request(app)
            .post(url)
            .send({
              name: "Contact",
              sFetch_test__Record_Type__c: "Contact",
              sFetch_test__Display_Template__c: "{{Name}}",
              sFetch_test__Query_Template__c: "{{Name}}"
            })
            .expect(204)
            .end(cb);
        }
      ], done);
    });
  });

});
