var express = require('express');
var router = express.Router();
var kue = require('kue')
  , queue = kue.createQueue();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/new_job', function(req, res) {
  res.render('jobs_new');
});

router.post('/create_job', function(req, res) {
  var reading  = req.body.txt;
  queue.create('reading', { reading: reading }).save();
  res.redirect("new_job");
});


module.exports = router;
