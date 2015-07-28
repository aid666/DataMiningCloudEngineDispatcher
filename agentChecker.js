var Client = require('node-rest-client').Client
var client = new Client();
var shortid = require('shortid');

function locateConsul(){
  return "http://localhost:12803/hub/";
}

module.exports.monitorWaitingQueue = function(){
  var url = locateConsul() + "nodes";
  client.get(
    url,
    function(data, response){
      var stringData = data.toString('utf-8');
      if(response.statusCode == 200){
        var agents = JSON.parse(stringData);
        for (item of agents) {
          console.log(item);
          agentsDB.insert(item);
        }
      }else{
        console.log("Failed to fetch the Agent");
      }
    });
}
