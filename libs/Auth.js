const redis = require('redis');
const config = require('config');
const request = require('request-promise');

function Auth(host){
  this.host   = 'https://app.buzzn.net';
  this.client = redis.createClient(6379, config.get('redis.host'));
}

Auth.prototype.login = function(options, callback) {
  var that = this;
  var options = {
      method: 'POST',
      uri: that.host + '/oauth/token',
      body: {
        grant_type: 'password',
        username: options.username,
        password: options.password,
        scope: 'full',
      },
      json: true
  };
  request(options)
    .then(function (response){
      that.setToken(response, function(token) {
        var options = {
          method: 'GET',
          uri: that.host + '/api/v1/users/me',
          auth: { bearer: token.accessToken },
          json: true
        };
        request(options)
          .then(function (response){
            that.setUser(response, function(user) {
              callback(true)
            });
          })
          .catch(function (err){
            callback(false)
          });
      })
    })
    .catch(function (err){
      callback(false)
    });
}

Auth.prototype.logout = function(callback) {
  var that = this;
  var client = that.client, multi;
  client.multi([
    ["del", "accessToken"],
    ["del", "refreshToken"],
    ["del", "createdAt"],
    ["del", "expiresIn"],
    ["del", "username"],
    ["del", "userId"],
  ]).exec(function (err, replies) {
    callback(true)
  });
}

Auth.prototype.setToken = function(response, callback) {
  var that = this;
  var client = that.client, multi;
  client.multi([
    ["set", "accessToken", response.access_token],
    ["set", "refreshToken", response.refresh_token],
    ["set", "createdAt", response.created_at],
    ["set", "expiresIn", response.expires_in],
  ]).exec(function (err, replies) {
    that.getToken(function(token) {
      callback(token)
    })
  });
}

Auth.prototype.setUser = function(response, callback) {
  var that = this;
  var client = that.client, multi;
  client.multi([
    ["set", "userId", response['data']['id']],
    ["set", "username", response['data']['attributes']['user-name']],
  ]).exec(function (err, replies) {
    that.getUser(function(user) {
      callback(user)
    })
  });
}


Auth.prototype.getToken = function(callback) {
  this.client.mget(['accessToken', 'refreshToken', 'createdAt', 'expiresIn'], function(err, reply) {
    if (err) {
      callback(null)
    } else {
      var token = {
        accessToken: reply[0],
        refreshToken: reply[1],
        createdAt: parseFloat(reply[2]),
        expiresIn: parseFloat(reply[3]),
        expiresAt: new Date((parseFloat(reply[2]) + parseFloat(reply[3]) ) * 1000 )
      }
      callback(token);
    }
  })
}

Auth.prototype.getUser = function(callback) {
  this.client.mget(['userId', 'username'], function(err, reply) {
    if (err) {
      callback(null)
    } else {
      var user = {
        userId: reply[0],
        username: reply[1]
      }
      callback(user);
    }
  })
}

Auth.prototype.getActiveToken = function(callback) {
  var that = this;
  that.loggedIn(function(token){
    if(token){
      callback(token)
    }else{
      that.refresh(function(token){
        callback(token)
      })
    }
  })
}


Auth.prototype.refresh = function(callback) {
  var that = this;
  this.client.get("refreshToken", function (err, reply) {
    var options = {
        method: 'POST',
        uri: that.host + '/oauth/token',
        body: {
          grant_type: 'refresh_token',
          refresh_token: reply
        },
        json: true
    };
    request(options)
      .then(function (response){
        that.setToken(response, function(token) {
          callback(token)
        })
      })
      .catch(function (err){
        callback(err)
      });
  });
}


Auth.prototype.loggedIn = function(callback) {
  this.getToken(function(token) {
    if (new Date() < token.expiresAt ){
      callback(token);
    }else{
      callback(false);
    }
  })
}


module.exports = Auth;
