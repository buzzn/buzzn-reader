const Redis = require('redis');
const config = require('config');
const request = require('superagent');

let host  = 'https://app.buzzn.net';
let redis = Redis.createClient(6379, config.get('redis.host'));

function Auth(host){
}

Auth.prototype.login = function(options, callback) {
  getTokenWithPassword(options, function(token){
    if (token){
      getUser(function(user){
        callback(user)
      })
    }else{
      callback(false);
    }
  })
}


function getTokenWithPassword(options, callback) {
  request
    .post(host + '/oauth/token')
    .send({
      grant_type: 'password',
      username: options.username,
      password: options.password,
      scope: 'smartmeter'
    })
    .end(function(err, res){
      if (err || !res.ok) {
        callback(err.body)
      } else {
        let token = JSON.stringify(res.body)
        redis.set("token", token, function (err, reply) {
          callback(token)
        });
      }
    });
}


function getTokenWithRefreshToken(callback) {
  redis.get('token', function (err, token) {
    if(err){
      console.error(err)
    }else{
      let _token = JSON.parse(token)
      request
        .post(host + '/oauth/token')
        .send({
          grant_type: 'refresh_token',
          refresh_token: _token.refresh_token
        })
        .end(function(err, res){
          if (err || !res.ok) {
            console.error(err);
          } else {
            let token = JSON.stringify(res.body)
            redis.set("token", token, function (err, reply) {
              if(err){
                console.error(err);
              }else{
                callback(token)
              }
            });
          }
        });
    }
  });
}


function getUser(callback) {
  redis.get('token', function (err, token) {
    if(err){
      console.error(err)
    }else{
      let _token = JSON.parse(token)
      request
        .get(host + '/api/v1/users/me')
        .set('Authorization', 'Bearer ' + _token.access_token)
        .end(function(err, res){
          if (err || !res.ok) {
            console.error(err);
          } else {
            let user = JSON.stringify(res.body)
            redis.set("user", user, function (err, reply) {
              callback(user)
            });
          }
        })
    }
  })
}




Auth.prototype.logout = function(callback) {
  var that = this;
  var _redis = redis, multi;
  _redis.multi([
    ["del", "token"],
    ["del", "user"],
    ["del", "meter"],
  ]).exec(function (err, replies) {
    callback(true)
  });
}



Auth.prototype.getToken = function(callback) {
  var that = this;
  that.loggedIn(function(token){
    if(token){
      callback(token)
    }else{
      getTokenWithRefreshToken(function(token){
        callback(token)
      })
    }
  })
}

Auth.prototype.loggedIn = function(callback) {
  redis.get('token', function (err, token) {
    if(err){
      console.error(err);
    } else {
      if(token){
        let _token = JSON.parse(token)
        if (new Date().getTime() < (_token.created_at + _token.expires_in)*1000){
          callback(token);
        }else{
          callback(false);
        }
      }else{
        callback(false);
      }
    }
  })
}


module.exports = Auth;
