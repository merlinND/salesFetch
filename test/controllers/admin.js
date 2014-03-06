'use strict';

var request = require('supertest');
var async = require('async');

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

  describe('/admin/context-profiler/new', function() {
    var endPoint = '/admin/context-profiler/';

    it('should accept well formated request', function(done) {
      async.series([
        function(cb) {
          var req = request(app)
            .post(endPoint,
            {
              record_type: 'Case',
              query_template: '{{Name}}',
              display_template: '{{Name}}'
            });
          agent.attachCookies(req);

          req
            .expect(302)
            .end(cb);
        },
        function(cb) {
          var req = request(app).get('/admin');
          agent.attachCookies(req);
          req
            .expect(200)
            .expect(function(res) {
              var options = res.text.match(/Targeted context/g);
              options.should.have.length(4);
            })
            .end(cb);
        }
      ], done);
    });

    it('should reject if duplicate object type', function(done) {
      var req = request(app)
        .post(endPoint,
        {
          record_type: 'Contact',
          query_template: '{{Name}}',
          display_template: '{{Name}}'
        });
      agent.attachCookies(req);

      req
        .expect(/New Context Profiler/)
        .expect(/alert-danger/)
        .end(done);
    });

    it('should reject if a missing field', function(done) {
      var keys = ['record_type', 'query_template', 'display_template'];

      async.each(keys, function(key, cb) {
        var contextProfiler = {
          record_type: 'Contact',
          query_template: '{{Name}}',
          display_template: '{{Name}}'
        };
        delete contextProfiler[key];
        var req = request(app)
          .post(endPoint, contextProfiler);
        agent.attachCookies(req);

        req
          .expect(/New Context Profiler/)
          .expect(/alert-danger/)
          .end(cb);
      }, done);
    });
  });

});