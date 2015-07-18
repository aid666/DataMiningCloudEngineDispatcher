var express = require('express');
var router = express.Router();

/* GET evaluation listing. */
router.get('/:type/:catalog/:resKey', function(req, res, next) {
  res.json({});
});


module.exports = router;
