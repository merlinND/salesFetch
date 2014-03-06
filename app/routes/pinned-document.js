'use strict';

var pinnedDocuments = require('../controllers/pinned-documents');
var authorization = require('../middlewares/authorization');

module.exports = function(app) {
  app.post('/pinned-documents', authorization.requiresLogin, pinnedDocuments.create);
  app.del('/pinned-documents/:documentId', authorization.requiresLogin, pinnedDocuments.destroy);
};
