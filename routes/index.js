var express = require('express');
var router = express.Router();
var kue = require('kue')
  , queue = kue.createQueue();

var redis = require('redis');
var redisClient = redis.createClient();

router.get('/', function(req, res, next) {
  redisClient.mget(['user'], function(err, reply) {
    if(reply[0] == null){
      res.redirect('token/new');
    }else{
      res.render('index', { title: "Welcome " + reply[0] });
    }
  });
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
