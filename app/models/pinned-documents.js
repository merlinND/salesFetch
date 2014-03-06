'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Pinned Document Schema
 */
var PinnedDocumentModel = new Schema ({
  created: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  documentId: {
    type: String,
    unique: true
  },
  attachedObjects: []
});

mongoose.model('PinnedDocument', PinnedDocumentModel);
