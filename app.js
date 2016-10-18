const config = require('config');
var kue = require('kue');
var queue = kue.createQueue({ redis: { host: config.get('redis.host') }});
var express = require('express');
var exphbs  = require('express-handlebars');
var session = require('express-session')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ui = require('kue-ui');

var index = require('./routes/index');
var auth = require('./routes/auth');

var app = express();

ui.setup({
  apiURL: '/api', // IMPORTANT: specify the api url
  baseURL: '/kue', // IMPORTANT: specify the base url
  updateInterval: 500 // Optional: Fetches new data every 5000 ms
});

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);
app.use('/api', kue.app);
app.use('/kue', ui.app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
