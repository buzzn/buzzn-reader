var express = require('express');
var router = express.Router();
var Auth = require('../libs/Auth');

router.get('/', function(req, res, next) {
  var auth = new Auth();
  auth.loggedIn(function(token){
    if(token){
      res.render('index', { title: 'loggedIn' });
    }else{
      res.redirect('auth/new');
    }
  })
});

module.exports = router;
