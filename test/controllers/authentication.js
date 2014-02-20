'use strict';

var request = require('supertest');
var crypto = require('crypto');

var app = require('../../app.js');


var createAuthHash = function(key, obj) {
  return crypto.createHmac("sha256", new Buffer(key, 'utf-8')).update(new Buffer(key)).digest("base64");
};

describe('authentication middleware', function() {
  it('reject unidentified user', function(done) {
    request(app)
      .post('/authenticate')
      .expect(401, done);
  });

  it('authenticate user', function(done) {
    var key = "BaZooM";
    var object = {
      foo: "cascade"
    };

    request(app)
      .post('/authenticate')
      .send(key + '.' + createAuthHash(object))
      .expect(200, done);
  });
});