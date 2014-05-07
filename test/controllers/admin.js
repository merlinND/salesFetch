'use strict';

require("should");

var app = require('../../app.js');
var cleaner = require('../hooks/cleaner');
var checkUnauthenticated = require('../helpers/access').checkUnauthenticated;

describe('<Admin controller>', function() {
  beforeEach(cleaner);

  describe('GET /admin page', function() {
    var endpoint = '/admin';

    checkUnauthenticated(app, 'get', endpoint);
  });
});
