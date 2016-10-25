var express = require('express');
var router = express.Router();

const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/store_eventlog', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //console.log(req);
  //console.log(req.body['event_log[]']);

  const events = req.body['event_log[]'];

  var file = fs.createWriteStream('log.csv');
  file.on('error', function(err) { /* error handling */ });

  events.forEach(function(v) { file.write(v + '\n'); });

  file.end();

});

module.exports = router;
