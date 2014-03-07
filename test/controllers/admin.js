'use strict';

var request = require('supertest');
var async = require('async');

var app = require('../../app.js');
var cleaner = require('../hooks/cleaner');
var login = require('../helpers/login').authenticateCall;
var APIs = require('../helpers/APIs');
var checkUnauthenticated = require('../helpers/access').checkUnauthenticated;


describe('<Admin controller>', function() {
  var agent;

  beforeEach(cleaner);
  beforeEach(function(cb) {
    APIs.mount('salesforce', 'https://eu2.salesforce.com', cb);
  });
  beforeEach(function(cb) {
    login(request(app), function(loginAgent) {
          agent = loginAgent;
          cb();
        });
  });

  describe('GET /admin', function() {
    var endpoint = '/admin';

    checkUnauthenticated(app, 'get', endpoint);

    it('should display the admin panel index', function(done) {
      var req = request(app).get(endpoint);
      agent.attachCookies(req);
      req
        .expect(200)
        .expect(/administration panel/)
        .end(done);
    });
  });

  describe('GET /admin/context-profiler/new', function() {
    var endpoint = '/admin/context-profiler/new';

    checkUnauthenticated(app, 'get', endpoint);

    it('should display the new formulaire', function(done) {
      var req = request(app).get(endpoint);
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

  describe('POST /admin/context-profiler/', function() {
    var endpoint = '/admin/context-profiler/';

    checkUnauthenticated(app, 'post', endpoint);

    it('should accept well formated request', function(done) {
      async.series([
        function(cb) {
          var req = request(app)
            .post(endpoint);
          agent.attachCookies(req);

          req
            .send({
              record_type: 'Case',
              query_template: '{{Name}}',
              display_template: '{{Name}}'
            })
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
        .post(endpoint);
      agent.attachCookies(req);

      req
        .send({
          record_type: 'Contact',
          query_template: '{{Name}}',
          display_template: '{{Name}}'
        })
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
          .post(endpoint);
        agent.attachCookies(req);

        req
          .send(contextProfiler)
          .expect(/New Context Profiler/)
          .expect(/alert-danger/)
          .end(cb);
      }, done);
    });
  });

  describe('GET /admin/context-profiler/:profile/delete', function() {
    var endpoint = function(id) {
      return '/admin/context-profiler/' + id + '/delete';
    };

    checkUnauthenticated(app, 'get', endpoint);

    it('should reject unauthentified user', function(done) {
      request(app)
        .get(endpoint('12334'))
        .expect(401)
        .end(done);
    });

    it('should return 404 if not found', function(done) {
      var req = request(app).get(endpoint('5318bdc7dea8330000db4757'));
      agent.attachCookies(req);
      req
        .expect(404)
        .end(done);
    });

    it('should effectively delete existing profilers', function(done) {
      async.waterfall([
        function(cb) {
          var req = request(app).get('/admin');
          agent.attachCookies(req);
          req
            .expect(function(res) {
              var options = res.text.match(/Targeted context/g);
              options.should.have.length(3);
            })
            .end(cb);
        },
        function(res, cb) {
          var id = res.text.match(/\/context-profiler\/(\w+)\/delete/)[1];

          var req = request(app).get(endpoint(id));
          agent.attachCookies(req);
          req
            .expect(302)
            .end(cb);
        }, function(_, cb) {
          var req = request(app).get('/admin');
          agent.attachCookies(req);
          req
            .expect(function(res) {
              var options = res.text.match(/Targeted context/g);
              options.should.have.length(2);
            })
            .end(cb);
        }
      ], done);
    });

  });

});
