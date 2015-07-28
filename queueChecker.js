var Client = require('node-rest-client').Client
var client = new Client();
var shortid = require('shortid');
var executorFactory = require('./executorFactory');
var agents = require('./agents');

function locateHub(){
  return "http://localhost:12803/hub/";
}

function getCheckerKey(){
  return "dispatcher-1"
}

function declareFlowToHub(procKey, checkStatus, msg, successCallback, denyCallback){
  var log = {
    datetime: new Date(),
    status: checkStatus,
    description: msg,
    checkerKey: getCheckerKey()
  }

  var url = locateHub() + "processes/" + procKey + "/checklogs";
  var args = {
    data: log,
    headers:{
      "Content-Type": "application/json"
    }
  }
  client.post(
    url,
    args,
    function(data, response){
        if( response.statusCode == 204 ){
          if(successCallback != null)
            successCallback();
        }else {
          if(denyCallback != null)
            denyCallback();
        }
    });
}

function checkingWaitQueue(waitingPros){
  var item = waitingPros.shift();
  if(item == null) return;

  console.log("Checking " + JSON.stringify(item));
  var err = agents.checkWaitProc(item.algorithms)
  if(err == null){
    console.log("Flow " + item._id + " is acceptable.")
    declareFlowToHub(
      item._id,
      "ACCEPT",
      "Accept this flow and ready to launch the process",
      function(){
        executorFactory.initSlot(item);
      },
      function(){
        //Hub deny the request, check next flow
        checkingWaitQueue(waitingPros);
      });
  }else{
    console.log("Failed to accept the process for " + err);
    declareFlowToHub(item._id, "DENY", err);
    checkingWaitQueue(waitingPros);
  }
}

module.exports.monitorWaitingQueue = function(){
  var url = locateHub() + "queue";
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
}
