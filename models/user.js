'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userModel = new Schema ({
  userId: {type: String, required: true, unique: true},
  name: String,
  email: String,
  company: ObjectId
});

module.exports = mongoose.model('User', userModel);