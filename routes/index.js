var express = require('express');
var router = express.Router();
var rest = require('restler');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Login with access token'
  });
});

router.post('/current-user', function(req, res) {
  rest.get('https://app.buzzn.net/api/v1/users/me',{
    accessToken: req.body.token
  }).on('success', function(data) {
    res.json(data);
  }).on('fail', function(data) {
    res.send('fail');
  });
});

module.exports = router;
