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
    auth.login(options, (error, response) => {
        if (error) {
            res.redirect('new');
        } else {
            res.redirect('/');
        }
    })
})

router.get('/logout', function(req, res) {
    var auth = new Auth();
    auth.logout((error, response) => {
        if (error) {
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    })
})


module.exports = router;
