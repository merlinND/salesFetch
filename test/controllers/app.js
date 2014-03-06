'use strict';

var request = require('supertest');
var app = require('../../app.js');
var login = require('../helpers/login');
var fetchAPI = require('../helpers/fetchAPI');

describe('<Application controller>', function() {
  var agent;

  before(function(done) {
    login(request(app), function(loginAgent) {
      agent = loginAgent;
      fetchAPI.mount(done);
    });
  });

  describe('/search page', function() {
    var endPoint = '/app/search';

    it('should reject unauthentified user', function(done) {
      request(app)
        .get(endPoint)
        .expect(401, done);
    });

    it('should allow access for authentified user', function(done) {
      var req = request(app).get(endPoint);
      agent.attachCookies(req);
      req.expect(200, done);
    });
  });

  describe('/context page', function() {
    var endPoint = '/app/context';

    it('should reject unauthentified user', function(done) {
      request(app)
        .get(endPoint)
        .expect(401, done);
    });

    it('should allow access for authentified user', function(done) {
      var req = request(app).get(endPoint);
      agent.attachCookies(req);
      req.expect(200, done);
    });
  });

  describe('/documents/:id page', function() {
    var endPoint = '/app/documents/123';

    it('reject unauthentified user', function(done) {
      request(app)
        .get(endPoint)
        .expect(401, done);
    });

  });

});
