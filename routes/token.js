var express = require('express');
var router = express.Router();
var rest = require('restler');

var redis = require('redis');
var redisClient = redis.createClient();

router.get('/new', function(req, res) {
  res.render('token_new', { title: 'Add New BearerToken' });
});

router.post('/create', function(req, res) {
  var token = req.body.token;
  rest.get('https://staging.buzzn.net/api/v1/users/me',{
    accessToken: token
  }).on('success', function(data) {
    redisClient.set('token', token);
    redisClient.set('user', data['data']['attributes']['email']);
    res.redirect("/");
  }).on('fail', function(data) {
    res.redirect('back');
  });
});


module.exports = router;
