var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var UserSchema = mongoose.Schema({
  name: String,
  email: String
});
var User = mongoose.model('User', UserSchema);


router.get('/index', function(req, res) {
  User.find({}, function(err, users) {
    res.render('users_index', {
      "userlist" : users
    });
  });
});


router.get('/new', function(req, res) {
  res.render('users_new', { title: 'Add New User' });
});


router.post('/create', function(req, res) {
  var userName  = req.body.username;
  var userEmail = req.body.useremail;
  var user = new User({ name: userName, email: userEmail });
  user.save(function (err, fluffy) {
    if (err) res.send("There was a problem adding the information to the database.");
    res.redirect("index");
  });
});


module.exports = router;
