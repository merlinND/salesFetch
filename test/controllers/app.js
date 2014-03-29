'use strict';

require("should");

var async = require('async');
var request = require('supertest');

var app = require('../../app.js');
var cleaner = require('../hooks/cleaner');
var requestBuilder = require('../helpers/login').requestBuilder;
var APIs = require('../helpers/APIs');
var checkUnauthenticated = require('../helpers/access').checkUnauthenticated;

describe('<Application controller>', function() {
  beforeEach(cleaner);
  beforeEach(function(done) {
    APIs.mount('fetchAPI', 'http://api.anyfetch.com', done);
  });

  describe('/context-search page', function() {
    var endpoint = '/app/context-search';

    checkUnauthenticated(app, 'get', endpoint);

    it.skip("should return contextual datas", function(done) {

      var context = {
        recordType: 'Contact',
        recordId: '003b000000LHOj3',
        templatedQuery: 'Walter White',
        templatedDisplay: 'Walter White'
      };

      async.waterfall([
        function buildRequest(cb) {
          requestBuilder(endpoint, context, cb);
        },
        function sendRequest(url, cb) {
          request(app)
            .get(url)
            .expect(200)
            .expect(function(res) {
              res.text.should.containDeep("Albert Einstein");
              res.text.should.containDeep("/app/documents/5309c5913a59fda826adc1d8");
            })
            .end(cb);
        }
      ], done);
    });
  });
});
