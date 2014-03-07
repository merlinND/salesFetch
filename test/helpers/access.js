'use strict';
var request = require('supertest');

module.exports.checkForAccess = function checkForAccess(app, verb, endpoint, agentGenerator) {
  module.exports.checkUnauthenticated(app, verb, endpoint);

  it('should allow access for authentified user', function(done) {
    var agent = agentGenerator();
    var req = request(app)[verb](endpoint);
    agent.attachCookies(req);
    req
      .expect(200)
      .end(done);
  });
};

module.exports.checkUnauthenticated = function checkUnauthenticated(app, verb, endpoint) {
  it('should reject unauthentified user', function(done) {
    request(app)
      [verb](endpoint)
      .expect(401)
      .end(done);
  });
};
