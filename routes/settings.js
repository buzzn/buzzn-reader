var express = require('express');
var router = express.Router();
var rest = require('restler');

var redis = require('redis');
var redisClient = redis.createClient();

router.get('/edit', function(req, res) {
  redisClient.mget(['host', 'token'], function(err, reply) {
    res.render('settings_edit', { host: reply[0], token: reply[1]  });
  });

});

router.post('/save', function(req, res) {
  var host = req.body.host;
  var token = req.body.token;
  rest.get(host + '/api/v1/users/me',{
    accessToken: token
  }).on('success', function(data) {
    redisClient.set('host', host);
    redisClient.set('token', token);
    redisClient.set('user', data['data']['attributes']['email']);
    res.redirect("/");
  }).on('fail', function(data) {
    res.redirect('back');
  });
});


module.exports = router;
