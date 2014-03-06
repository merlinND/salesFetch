'use strict';

var request = require('supertest');
var app = require('../../app.js');
var login = require('../helpers/login');
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

    it('should reject unauthentified user', function(done) {
      request(app)
        .get(endPoint)
        .expect(401)
        .end(done);
    });

    it('should allow access for authentified user', function(done) {
      var req = request(app).get(endPoint);
      agent.attachCookies(req);
      req
        .expect(200)
        .end(done);
    });
  });

  describe('/documents/:id page', function() {
    before(function(done) {
      login(request(app), function(loginAgent) {
        agent = loginAgent;
        fetchAPI.mount(done);
      });
    });

    var endPoint = '/app/documents/5309c57d9ba7daaa265ffdc9';

    it('should reject unauthentified user', function(done) {
      request(app)
        .get(endPoint)
        .expect(401)
        .end(done);
    });

    it('should allow access for authentified user', function(done) {
      var req = request(app).get(endPoint);
      agent.attachCookies(req);
      req
        .expect(200)
        .end(done);
    });
  });

});
