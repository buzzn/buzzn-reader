var express = require('express');
var router = express.Router();
var rest = require('restler');

var redis = require('redis');
var redis = redis.createClient();

router.get('/', function(req, res) {
  redis.get('token', function(err, reply) {
    res.render('bearers_index', {
      "token" : reply
    });
  });
});


router.get('/new', function(req, res) {
  res.render('bearers_new', { title: 'Add New BearerToken' });
});


router.post('/create', function(req, res) {
  var token  = req.body.token;

  rest.get('https://staging.buzzn.net/api/v1/users/me',{
    accessToken: token
  }).on('success', function(data) {
    redis.set('token', token, function(err, reply) {
      res.redirect("index");
    });
  }).on('fail', function(data) {
    res.send('fail');
  });

});


module.exports = router;
