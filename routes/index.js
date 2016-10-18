var express = require('express');
var router = express.Router();
var Auth = require('../libs/Auth');

router.get('/', function(req, res, next) {
    var auth = new Auth();
    auth.loggedIn((error, token) => {
        if (error) {
            res.redirect('auth/new');
        } else {
            res.render('index', {
                title: 'loggedIn'
            });
        }
    })
});

module.exports = router;;
