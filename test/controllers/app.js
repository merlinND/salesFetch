'use strict';

var request = require('supertest');
var app = require('../../app.js');
var login = require('../helpers/login');

describe('<Application controller>', function() {

  describe('/search page', function() {
    var agent;

    before(function (done) {
      login(request(app), function (loginAgent) {
        agent = loginAgent;
        done();
      });
    });


    it('reject unidentified user', function(done) {
      request(app)
        .get('/app/search')
        .expect(401, done);
    });

    it('should allow access for authenticatd user', function(done) {
      var req = request(app).get('/app/search');
      agent.attachCookies(req);
      req.expect(200, done);
    });
  });

});