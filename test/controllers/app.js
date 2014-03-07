'use strict';

require("should");

var async = require('async');
var app = require('../../app.js');
var cleaner = require('../hooks/cleaner');
var authenticatedCall = require('../helpers/authenticated-call').authenticatedCall;
var APIs = require('../helpers/APIs');
var checkUnauthenticated = require('../helpers/access').checkUnauthenticated;

describe.only('<Application controller>', function() {
  beforeEach(cleaner);
  beforeEach(function(done) {
    APIs.mount('fetchAPI', 'http://api.anyfetch.com', done);
  });

  describe('/context-search page', function() {
    var endpoint = '/app/context-search';

    checkUnauthenticated(app, 'get', endpoint);

    it("should return contextual datas", function(done) {
      var parameters = {
        url: '/app/context-search',
        parameters: {
          record_type: 'Contact',
          record_id: '003b000000LHOj3'
        }
      };

      async.waterfall([
        function buildRequest(cb) {
          authenticatedCall(app, parameters, cb);
        },
        function sendRequest(req, cb) {
          req
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

  describe('/documents/:id page', function() {
    var endpoint = '/app/documents/5309c57d9ba7daaa265ffdc9';
    checkUnauthenticated(app, 'get', endpoint);

    it("should return document datas", function(done) {
      var parameters = {
        url: '/app/documents/5309c57d9ba7daaa265ffdc9',
      };

      async.waterfall([
        function buildRequest(cb) {
          authenticatedCall(app, parameters, cb);
        },
        function sendRequest(req, cb) {
          req
            .expect(200)
            .expect(function(res) {
              res.text.should.containDeep("pdf2htmlEX");
              res.text.should.containDeep("mehdi.bouheddi@papiel.fr");
            })
            .end(cb);
        }
      ], done);
    });
  });

});
