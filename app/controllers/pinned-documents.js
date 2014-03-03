'use strict';

var async = require('async');
var mongoose = require('mongoose'),
    PinnedDocument = mongoose.model('PinnedDocument');

/**
 * Create a pinned document
 */
exports.create = function(req, res) {
  var pinnedDocument = new PinnedDocument(req.body);
  pinnedDocument.creator = req.user;

  pinnedDocument.save(function(err) {
    if (err) {
      return res.send(500, {
        errors: err.errors,
        pinned_document: pinnedDocument
      });
    }

    res.send(pinnedDocument);
  });
};


/**
 * Destroy a pinned Document
 */
exports.destroy = function(req, res) {
  var documentId = req.params.documentId;

  async.waterfall([
    function(cb) {
      PinnedDocument.findOne({id: documentId}, function(err, pinnedDocument) {
        if (err) {
          return cb({ errors: err.errors });
        }
        if (!pinnedDocument) {
          return cb({ errors: 'Failed to load pinned document ' + documentId });
        }

        cb(null, pinnedDocument);
      });
    }, function(pinnedDocument, cb) {
      pinnedDocument.remove(function(err) {
        if (err) {
          return cb({ errors: err.errors });
        }

        cb(null, pinnedDocument);
      });
    }
  ], function(err, pinnedDocument) {
    if (err) {
      return res.send(404, err);
    }

    res.send(pinnedDocument);
  });
};