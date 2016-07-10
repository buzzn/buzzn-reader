var express = require('express');
var router = express.Router();
var kue = require('kue')
  , queue = kue.createQueue();

var redis = require('redis');
var redisClient = redis.createClient({ host: 'redis', port: 6379 });

router.get('/', function(req, res, next) {
  redisClient.mget(['user'], function(err, reply) {
    if(reply[0] == null){
      res.redirect('settings/edit');
    }else{
      res.render('index', { title: "Welcome " + reply[0] });
    }
  });
});

module.exports = router;
