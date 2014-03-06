'use strict';

var request = require('supertest');
var app = require('../../app.js');
var login = require('../helpers/login');
var APIs = require('../helpers/APIs');

describe('<Admin controller>', function() {
  var agent;

  beforeEach(function(done) {
    login(request(app), function(loginAgent) {
      agent = loginAgent;
      APIs.mount('salesforce', 'https://eu2.salesforce.com', done);
    });
  });

  describe('/admin page', function() {
    var endPoint = '/admin';

    it('should reject unauthentified user', function(done) {
      request(app)
        .get(endPoint)
        .expect(401)
        .end(done);
    });

    it('should display the admin panel index', function(done) {
      var req = request(app).get(endPoint);
      agent.attachCookies(req);
      req
        .expect(200)
        .expect(/administration panel/)
        .end(done);
    });
  });

  describe('/admin/context-profiler/new', function() {
    var endPoint = '/admin/context-profiler/new';

    it('should reject unauthentified user', function(done) {
      request(app)
        .get(endPoint)
        .expect(401)
        .end(done);
    });

    it('should display the new formulaire', function(done) {
      var req = request(app).get(endPoint);
      agent.attachCookies(req);
      req
        .expect(200)
        .expect(/New Context Profiler/)
        .expect(function(res) {
          var options = res.text.match(/<option/g);
          options.should.have.length(2);
        })
        .end(done);
    });
  });

});