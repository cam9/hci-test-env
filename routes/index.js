var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


const fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post(
    '/store_eventlog',
    bodyParser.json({limit: '500mb', type:'application/json'}),
    bodyParser.urlencoded({limit: '500mb', extended: false, parameterLimit: Number.MAX_SAFE_INTEGER, type:'application/x-www-form-urlencoding' }),

    function(req, res, next) {
  console.log(" writing..");
  const events = req.body['event_log[]'];
  var file = fs.createWriteStream('log.csv', {'flags': 'a'});

  file.on('error', function(err) { console.log(err) });
  for(i in events)
    file.write(events[i] + '\n');
  //fs.appendFile('old_log.csv', v + '\n');
  file.end();

  //file.end();
  console.log("written");

});

router.post('/close_file', function (req) {

});

module.exports = router;
