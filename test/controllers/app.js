'use strict';

var request = require('supertest');
var app = require('../../app.js');
var login = require('../helpers/login');
var checkForAccess = require('../helpers/access').checkForAccess;
var fetchAPI = require('../helpers/fetchAPI');

describe('<Application controller>', function() {
  var agent;


  describe('/context-search page', function() {
    before(function(done) {
      login(request(app), function(loginAgent) {
        agent = loginAgent;
        fetchAPI.mount(done);
      });
    });
    var endPoint = '/app/context-search';

    checkForAccess(app, 'get', endPoint, function() { return agent; });
  });

  describe('/documents/:id page', function() {
    before(function(done) {
      login(request(app), function(loginAgent) {
        agent = loginAgent;
        fetchAPI.mount(done);
      });
    });

    var endPoint = '/app/documents/5309c57d9ba7daaa265ffdc9';
    checkForAccess(app, 'get', endPoint, function() { return agent; });
  });

});
