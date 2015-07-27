var Client = require('node-rest-client').Client
var client = new Client

var shortid = require('shortid');


function locateHub(){
  return "http://localhost:12803/hub/";
}

function locateProcessURL(){
  return locateHub() + "processes/";
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


function assembleExecutor(slotId){
  console.log("Locate the slot" + slotId);
  return {
    run: function(){
      console.log("Run the slot:" + slotId);

      console.log("Fetch the data of the slot:" + slotId);

      console.log("Locate the agent and send the input data");
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
            console.log("Fetch the input data");

            fetchInputData(
              procKey,
              function(data){
                console.log("Put the init data");
                assembleExecutor(slotId).run();
              });

          });
      });
  },
}
