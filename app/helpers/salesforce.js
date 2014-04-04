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
  var conn = salesforceConn(params);

  async.parallel([
    function createRecord(cb) {
      conn.sobject("sFetch_test__Context_Profiler__c")
        .create(newCP, cb);
    }, function createAssociatedPage(cb) {
      var template = '<apex:page id="salesFetch' + newCP.name + 'Page" StandardController="'+ newCP.name +'"  docType="html-5.0"> \n';
      template += '  <c:IframeContextComponent ObjectType="'+ newCP.name +'" ObjectId="{!'+ newCP.name +'.Id}"/> \n';
      template += '</apex:page>';

      var data = {
        content: new Buffer(template).toString('base64'),
        apiVersion: 29.0,
        description: 'Context profiler visual page for ' + newCP.name +'. \n /!\\ Please use the SalesFetch Panel to delete the page!',
        fullName: newCP.name + 'ContextProfilerPage',
        label: newCP.name + 'ContextProfilerPage',
        availableInTouch: true
      };

      conn.metadata.create('ApexPage', data).complete(cb);
    }
  ], cb);
};

module.exports.deleteContextProfiler = function(params, id, cb) {
  salesforceConn(params).sobject("sFetch_test__Context_Profiler__c").destroy(id, cb);
};
