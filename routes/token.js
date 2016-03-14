var express = require('express');
var router = express.Router();
var rest = require('restler');

var redis = require('redis');
var redisClient = redis.createClient();

router.get('/show', function(req, res) {
  redisClient.mget(['token', 'metering_point_id'], function(err, reply) {
    res.render('token_show', { token: reply[0], meteringPointId: reply[1]  });
  });
});


router.get('/new', function(req, res) {
  res.render('token_new', { title: 'Add New BearerToken' });
});


router.post('/create', function(req, res) {
  var token = req.body.token;
  var meteringPointId = req.body.meteringPointId;

  rest.get('https://staging.buzzn.net/api/v1/users/me',{
    accessToken: token
  }).on('success', function(data) {
    redisClient.set('token', token);
    redisClient.set('metering_point_id', meteringPointId);
    res.redirect("show");
  }).on('fail', function(data) {
    res.redirect('back');
  });

});


module.exports = router;
