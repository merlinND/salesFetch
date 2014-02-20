'use strict';

var request = require('supertest');

var app = require('../../app.js');

describe('<user controller>', function() {
  describe('/authenticate endpoint', function() {
    it('reject unidentified user', function(done) {
      request(app)
        .post('/authenticate')
        .expect(401, done);
    });
  });
});