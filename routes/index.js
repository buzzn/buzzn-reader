var express = require('express');
var router = express.Router();
var kue = require('kue')
  , queue = kue.createQueue();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/new_job', function(req, res) {
  res.render('jobs_new', { title: 'Add Job' });
});

router.post('/create_job', function(req, res) {
  var txt  = req.body.txt;
  queue.create('txt', { txt: txt }).save();
  res.redirect("new_job");
});


module.exports = router;
