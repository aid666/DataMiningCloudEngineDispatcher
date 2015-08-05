var express = require('express');
var router = express.Router();

var agents = require('../agents');

router.get("", function(res, req, next){
    agents.syncAgents(function(data){
      res.json(data);
    });
});

module.exports = router;
