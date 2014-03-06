'use strict';

var async = require('async');
var request = require('request');
var Mustache = require('mustache');


var baseRequest = function() {
  var payload = {
    headers: {
      'Authorization': 'Basic ' + process.env.FETCHAPI_CREDS
    }
  };

  return request.defaults(payload);
};


module.exports.findDocuments = function(params, cb) {
  async.parallel([
    function loadDocumentTypes(cb) {
      baseRequest('http://api.anyfetch.com/', cb);
    },
    function(cb){
      baseRequest({
        url: 'http://api.anyfetch.com/documents',
        qs: params
      }, cb);
    }
  ], function(err, data){
    if (err) {
      return cb(err);
    }
    var docReturn = JSON.parse(data[1][0].body);
    var rootReturn = JSON.parse(data[0][0].body);

    docReturn.datas.forEach(function(doc) {
      var relatedTemplate = rootReturn.document_types[doc.document_type].template_snippet;
      doc.snippet_rendered = Mustache.render(relatedTemplate, doc.datas);

      doc.provider = rootReturn.provider_status[doc.token].name;
      doc.document_type = rootReturn.document_types[doc.document_type].name;
    });

    cb(null, docReturn);
  });
};

module.exports.findDocument = function(id, cb) {
  async.parallel([
    function(cb) {
      request(baseRequest('http://api.anyfetch.com', cb));
    },
    function(cb){
      baseRequest({
        url: 'http://api.anyfetch.com/documents/' + id,
      }, cb);
    }
  ], function(err, data){
    if (err) {
      return cb(err);
    }

    var docReturn = JSON.parse(data[1][0].body);
    var rootReturn = JSON.parse(data[0][0].body);

    var relatedTemplate = rootReturn.document_types[docReturn.document_type].template_full;
    docReturn.full_rendered = Mustache.render(relatedTemplate, docReturn.datas);

    docReturn.provider = rootReturn.provider_status[docReturn.token].name;
    docReturn.document_type = rootReturn.document_types[docReturn.document_type].name;

    cb(null, docReturn);
  });
};
