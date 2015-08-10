var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  slotDB.find({}, function(err, docs){
    if(err == null){
      res.json(docs);
    }
  })
});

router.get('/:slotId', function(req, res, next) {
  slotDB.find({"_id": slotId}, function(err, docs){
    if(err == null && docs.length == 1){
      res.json(docs[1]);
    }else{
      res.sendStatus(404);
    }
  })
});

router.get('/:slotId/events', function(req, res, next) {
  slotDB.find({"_id": slotId}, function(err, docs){
    if(err == null && docs.length == 1){
      slotEvents.find({"slotId": slotId}, function(err, docs){
        if(err == null){
          res.json(docs);
        }else{
          res.sendStatus(404);
        }
      })
    }else{
      res.sendStatus(404);
    }
  })
});

router.post('/:slotId/events', function(req, res, next) {
  slotDB.find({"_id": slotId}, function(err, docs){
    if(err == null && docs.length == 1){
      var taskEvent = {
        "slotId": slotId,
      }

      slotEvents.insert(taskEvent, function(err, newDoc){
        if(err == null){
          res.json(newDoc);
        }else{
          res.sendStatus(503);
        }
      })
    }else{
      res.sendStatus(404);
    }
  })
});

module.exports = router;
