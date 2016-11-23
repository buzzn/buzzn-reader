var express = require('express');
var router = express.Router();
var Auth = require('../libs/Auth');

router.get('/', function(req, res, next) {
    var auth = new Auth();
    auth.loggedIn()
      .then(
        resolved => {
          res.render('index', {
              title: 'loggedIn'
          })
        },
        rejected => res.redirect('auth/new')
      )
});

module.exports = router;;
