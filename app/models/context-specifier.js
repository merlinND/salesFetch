'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Pinned Document Schema
 */
var ContextSpecifierModel = new Schema ({
  created: {
    type: Date,
    default: Date.now
  },
  organization: {
    type: Schema.ObjectId,
    ref: 'Organization'
  },
  query_template: {
    type: String,
    trim: true
  },
  display_template: {
    type: String,
    trim: true
  }
});

/**
 * Validations
 */
ContextSpecifierModel.path('query_template').validate(function(queryTemplate) {
  return queryTemplate.length;
}, 'Query template cannot be blank');

ContextSpecifierModel.path('display_template').validate(function(displayTemplate) {
  return displayTemplate.length;
}, 'Display template cannot be blank');


mongoose.model('ContextSpecifier', ContextSpecifierModel);