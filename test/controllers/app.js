'use strict';

var request = require('supertest');
var app = require('../../app.js');
var login = require('../helpers/login');
var APIs = require('../helpers/APIs');

describe('<Application controller>', function() {
  var agent;

  before(function(done) {
    login(request(app), function(loginAgent) {
      agent = loginAgent;
      APIs.mount('fetchAPI', 'http://api.anyfetch.com', done);
    });
  });

  describe('/context page', function() {
    var endPoint = '/app/context';

    it('should reject unauthentified user', function(done) {
      request(app)
        .get(endPoint)
        .expect(401)
        .end(done);
    });

    it.skip('should allow access for authentified user', function(done) {
      var req = request(app).get(endPoint);
      agent.attachCookies(req);
      req
        .expect(200)
        .end(done);
    });
  });

  describe('/documents/:id page', function() {
    var endPoint = '/app/documents/123';

    it('reject unauthentified user', function(done) {
      request(app)
        .get(endPoint)
        .expect(401)
        .end(done);
    });
  });

});
