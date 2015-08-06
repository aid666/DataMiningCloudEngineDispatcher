var Client = require('node-rest-client').Client
var client = new Client();
var shortid = require('shortid');

module.exports = {

  /*
    The sync function will fetch the agents list from a DataCenter.
    And for each agents, the dispatcher will query its status, capicity.
  */
  syncAgents: function(callback){
    agentsDB.find({}, function(err, docs){
      if(docs.length == 0){
        agentsDB.insert({
          alg: "NaiveBayesClassifier",
          url: "http://localhost:12805/"
        },
        function(err, newDoc){
          //console.log(JSON.stringify(newDoc));
        });
      } else {
        agentsArray = {};
        for (item of docs) {
          var algKey = item.alg;
          if(agentsArray[algKey] == null){
            agentsArray[algKey] = [];
          }
          agentsArray[algKey].push(item.url);
        }
        if(callback != null){
          callback(agentsArray);
        }
      }
    })
  },

  pickAgent: function(alg, successCallback, errorCallback){
    agentsDB.find({algorithm: alg}, function(err, docs){
      if(dcos.count > 0 && successCallback != null){
        successCallback(docs[0]);
      }else {
        errorCallback(null);
      }
    })
  },

  checkWaitProc: function(algs){
    if( algs == null || algs.length == 0 ){
      return "Empty algs array";
    }else{
      for (alg of algs) {
        if(agentsArray[alg] == null){
          return "Can't support alg: " + alg;
        }
      }
    }
    return null;
  },
}
