var Client = require('node-rest-client').Client
var client = new Client();
var shortid = require('shortid');

function checkAgentStatus(item){
  console.log("Check status for " + JSON.stringify(item));
  /*
  var url = item.url + "/status";
  client.get(
    url,
    function(data, response){
      var stringData = data.toString('utf-8');
      if(response.statusCode == 200){
        checkingWaitQueue(JSON.parse(stringData));
      }else{
        console.log("Failed to fetch the waiting queue");
      }
    });
    */
}

module.exports = {

  /*
    The sync function will fetch the agents list from a DataCenter.
    And for each agents, the dispatcher will query its status, capicity.
  */
  syncAgents: function(callback){
    agentsDB.find({}, function(err, docs){
      agentsArray = {};
      for (item of docs) {
        for(algKey of item.algs){
          if(agentsArray[algKey] == null){
            agentsArray[algKey] = [];
          }
          agentsArray[algKey].push(item.url);
        }
        checkAgentStatus(item);
      }
      if(callback != null){
        callback(agentsArray);
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
