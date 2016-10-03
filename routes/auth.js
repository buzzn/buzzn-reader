var express = require('express');
var router = express.Router();

var Auth = require('../libs/Auth');

router.get('/new', function(req, res) {
  res.render('login_new');
});

router.post('/login', function(req, res) {
  var auth = new Auth();
  var options = {
      username: req.body.username,
      password: req.body.password
  };
  auth.login(options, function(response){
    if(response){
      res.redirect('/');
    }else {
      res.redirect('new');
    }
  })
});

router.get('/logout', function(req, res) {
  var auth = new Auth();
  auth.logout(function(response){
    if(response){
      res.redirect('/');
    }else {
      res.redirect('new');
    }
  })
});


module.exports = router;
