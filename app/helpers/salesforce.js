'use strict';

var jsforce = require('jsforce');
var async = require('async');
var _ = require('lodash');

var salesforceConn = function(params) {
  return new jsforce.Connection({
    instanceUrl : params.instanceURL,
    accessToken : params.sessionId
  });
};

module.exports.getContextProfilers = function(params, cb) {
  salesforceConn(params).sobject("sFetch_test__Context_Profiler__c")
    .select("*")
    .execute(cb);
};

module.exports.avaibleSObjectsForContextProfilers = function(params, cb) {
  var conn = salesforceConn(params);

  async.parallel([
    function retrieveObject(cb) {
      conn.describeGlobal(function(err, data) {
        if (err) {
          return cb(err);
        }

        var availableObjects = _.where(data.sobjects, {'layoutable': true, 'activateable': false});
        cb(null, availableObjects);
      });
    }, function getAllContextProfilers(cb) {
      conn.sobject("sFetch_test__Context_Profiler__c")
        .select("*")
        .execute(cb);
    }
  ], function(err, data) {
    if(err) {
      return cb(err);
    }

    var allObj = data[0];
    var existingCP = data[1];

    existingCP.forEach(function(cP) {
      var found = false;

      for (var i = 0; i < allObj.length && !found; i+= 1) {
        if (allObj[i].name === cP.sFetch_test__Record_Type__c) {
          found = true;
          allObj.splice(i,1);
        }
      }

    });

    cb(null, allObj);
  });
};

module.exports.createContextProfiler = function(params, newCP, cb) {
  salesforceConn(params).conn.sobject("sFetch_test__Context_Profiler__c")
    .create(newCP, cb);
};

module.exports.createContextPage = function(params, contextProfilerId, isMobile, cb) {
  var conn = salesforceConn(params);

  async.waterfall([
    function retrieveContextProfiler(cb) {
      conn.sobject("sFetch_test__Context_Profiler__c")
        .retrieve(contextProfilerId, cb);
    }, function createAssociatedPage(contextProfiler, cb) {
      var type = isMobile ? 'Desktop' : 'Mobile';

      var template = '<apex:page id="salesFetch' + contextProfiler.Name + 'Page" StandardController="'+ contextProfiler.Name +'"  docType="html-5.0"> \n';
      template += '  <c:IframeContextComponent ObjectType="'+ contextProfiler.Name +'" ObjectId="{!'+ contextProfiler.Name +'.Id}"/> \n';
      template += '</apex:page>';

      var data = {
        content: new Buffer(template).toString('base64'),
        apiVersion: 29.0,
        description: 'Context profiler visual page for ' + contextProfiler.Name +'. \n /!\\ Please use the SalesFetch Panel to delete the page!',
        fullName: contextProfiler.Name + 'ContextPage' + type,
        label: contextProfiler.Name + 'ContextPage' + type,
        availableInTouch: isMobile
      };

      conn.metadata.create('ApexPage', data).complete(function(err,data){
        if (data.state === 'Error') {
          err = 'Templating error on Salesforce';
        }

        cb(err,data);
      });
    }
  ], cb);
};

module.exports.deleteContextProfiler = function(params, id, cb) {
  salesforceConn(params).sobject("sFetch_test__Context_Profiler__c").destroy(id, cb);
};
