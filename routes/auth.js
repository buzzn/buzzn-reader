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
    auth.login(options)
      .then(
        resolved => res.redirect('/'),
        rejected => res.redirect('new')
      )

})

router.get('/logout', function(req, res) {
    var auth = new Auth();
    auth.logout()
      .then(
        resolved => res.redirect('/'),
        rejected => res.redirect('/')
      )
})


module.exports = router;
