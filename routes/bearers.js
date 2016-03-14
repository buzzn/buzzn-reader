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
// 58d322f0542b9431711616eb27b8e39c500f21130165796a8ed43e9bfc805f6d

router.post('/create', function(req, res) {
  var token  = req.body.token;

  var bearer = new Bearer({ token: token });

  rest.get('https://app.buzzn.net/api/v1/users/me',{
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
