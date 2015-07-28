var Client = require('node-rest-client').Client
var client = new Client();
var shortid = require('shortid');

agents = {},

module.exports = {

  syncAgents: function(){
    agentsDB.find({}, function(err, docs){
      if(docs.length == 0){
        agentsDB.insert({
          alg: "NaiveBayesClassifier",
          url: "http://localhost:12805/"
        },
        function(err, newDoc){
          console.log(JSON.stringify(newDoc));
        });
      } else {
        agents = {};
        for (item of docs) {
          var algKey = item.alg;
          if(agents[algKey] == null){
            agents[algKey] = [];
          }
          agents[algKey].push(item.url);
        }
        console.log(agents);
      }
    })
  },

  checkWaitProc: function(algs){
    if( algs == null || algs.length == 0 ){
      return "Empty algs array";
    }else{
      for (alg of algs) {
        if(agents[alg] == null){
          return "Can't support alg: " + alg;
        }
      }
    }
    return null;
  },
}
