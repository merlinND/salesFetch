'use strict';

var request = require('supertest');
var app = require('../../app.js');

describe('canvas controller', function() {
  it('reject unidentified user', function(done) {
    request(app)
      .get('/canvas')
      .expect(401, done);
  });
});