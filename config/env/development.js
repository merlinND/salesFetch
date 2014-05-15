'use strict';

module.exports = {
  mongo_url: 'mongodb://localhost/salesfetch-dev',

  // SSL certificates used for development
  certificates: {
    key: '/config/ssl-key.pem',
    cert: '/config/ssl-cert.pem'
  },

  // Disable template caching
  swig: {
    cache: false
  }
};