var express = require('express');
var router = express.Router();
var rest = require('restler');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var BearerSchema = mongoose.Schema({
  token: String
});
var Bearer = mongoose.model('Bearer', BearerSchema);


router.get('/', function(req, res) {
  Bearer.find({}, function(err, bearers) {
    res.render('bearers_index', {
      "bearers" : bearers
    });
  });
});


router.get('/new', function(req, res) {
  res.render('bearers_new', { title: 'Add New BearerToken' });
});


router.post('/create', function(req, res) {
  var token  = req.body.token;

  var bearer = new Bearer({ token: token });

  rest.get('https://staging.buzzn.net/api/v1/users/me',{
    accessToken: token
  }).on('success', function(data) {
    bearer.save(function (err, fluffy) {
      res.send(token);
      // res.redirect("index");
    });
  }).on('fail', function(data) {
    res.send('fail');
  });


});


module.exports = router;
