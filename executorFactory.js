var Client = require('node-rest-client').Client
var client = new Client

var shortid = require('shortid');

function locateHub(){
  return "http://localhost:12803/hub/";
}

function locateProcessURL(){
  return locateHub() + "processes/";
}

function locateNextNode(slotId, nodeId, callback){
  return null;
}

function locateAgent(){
  return null;
}

function fetchFlow(procKey, next){
  console.log("Fetch the processers of " + procKey);
  var url = locateProcessURL() + procKey + "/flow";
  client.get(
    url,
    function(data, response){
      var stringData = data.toString('utf-8');
      if(response.statusCode == 200){
        console.log("fetch flow");
        next(JSON.parse(stringData));
      }else{
        console.log("Failed to fetch the waiting queue");
      }
    });
}

function fetchInputData(procKey, next){

  var url = locateProcessURL() + procKey + "/data";
  client.get(
    url,
    function(data, response){
      var stringData = data.toString('utf-8');
      if(response.statusCode == 200){
        console.log("fetch data");
        next(JSON.parse(stringData));
      }else{
        console.log("Failed to fetch the waiting queue");
      }
    });
}

function createSlot(flow, next){
  console.log("Create slot based on the flow " + JSON.stringify(flow));
  var slotId = shortid.generate();

  console.log("create slot as " + slotId);
  next(slotId);
}

function pushDataToSlots(slotId, workerKey, data, succCallback){
  var eventData = {
    "slotId": slotId,
    "workerKey": workerKey,
    "data": data
  }

  slotData.insert(eventData, function(err, doc){
    if(succCallback != null){
      succCallback();
    }
  });
}

function assembleExecutor(slotId, nodeId){
  return {
    run: function(){
      console.log("Run the slot:" + slotId);

      locateNextNode(slotId, nodeId, function(nextNode){
        console.log("Get next node " + nextNode);

        locateAgent(nextNode.alg, function(agentKey){
          console.log("Fetch the data of the slot:" + slotId);
          slotData.find(
            {
              "slotId": slotId,
              "nodeId": workerKey
            },
            function(err, docs){
              console.log(docs);
              console.log("Locate the agent and send the input data");

          })
        })
      })
    }
  }
}

module.exports = {
  "assembleExecutor": assembleExecutor,

  initSlot: function (processflow){
    var procKey = processflow._id;
    console.log("Start to create instance for process flow: " + procKey);
    fetchFlow(
      procKey,
      function(flow){
        console.log("Create the slot and deploy the flow in it.");

        createSlot(
          flow,
          function(slotId){
            console.log("Start to fetch the input data");
            fetchInputData(
              procKey,
              function(data){
                console.log("Put the init data");
                pushDataToSlots(slotId, data, function(){
                  assembleExecutor(slotId).run();
                })
              });

          });
      });
  },
}
