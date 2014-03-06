'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var defaultCP = require('../../config/default-context-profilers');

/**
 * Organization Schema
 */
var OrgModel = new Schema ({
  created: {
    type: Date,
    default: Date.now
  },
  organizationId: {
    type: String,
    unique: true
  },
  name: String,
  currency: String,
  context_profilers: [{
    record_type: String,
    query_template: String,
    display_template: String
  }]
});

/**
 * Validations
 */
OrgModel.path('context_profilers').validate(function(contextProfilers) {
  // Check if there is duplication in record profilers
  var recordTypes = _.pluck(contextProfilers, 'record_type');
  recordTypes = _.uniq(recordTypes);
  return recordTypes.length === contextProfilers.length;
}, 'Record type in context profilers should be unique');

OrgModel.path('context_profilers').validate(function(contextProfilers) {
  // Check if there is missing record type missing
  var rest = _.rest(contextProfilers, function(profiler) {
    return profiler.record_type;
  });
  return !rest.length;
}, 'Record type should be set');

OrgModel.path('context_profilers').validate(function(contextProfilers) {
  // Check if there is missing record type missing
  var rest = _.rest(contextProfilers, function(profiler) {
    return profiler.query_template;
  });
  return !rest.length;
}, 'Query template should be set');

OrgModel.path('context_profilers').validate(function(contextProfilers) {
  // Check if there is missing record type missing
  var rest = _.rest(contextProfilers, function(profiler) {
    return profiler.display_template;
  });
  return !rest.length;
}, 'Display template should be set');

/**
 * Pre-save hook
 */
OrgModel.pre('save', function(next) {

  if (!this.isNew) {
    return next();
  }

  this.context_profilers = defaultCP;
  next();
});

mongoose.model('Organization', OrgModel);
