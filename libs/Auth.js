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
      uri: this.host + '/oauth/token',
      body: {
        grant_type: 'password',
        username: options.username,
        password: options.password,
        scope: 'smartmeter',
      },
      json: true
  };
  request(options)
    .then(function (token){
      that.setToken(token, function() {
        callback(token)
      })
    })
    .catch(function (err){
      callback(err.error)
    });
}

Auth.prototype.setToken = function(token, callback) {
  this.client.set("accessToken", token.access_token);
  this.client.set("refreshToken", token.refresh_token);
  this.client.set("createdAt", token.created_at);
  this.client.set("expiresIn", token.expires_in);

  this.getToken(function(token) {
    callback(token)
  })
}

Auth.prototype.getToken = function(callback) {
  var that = this;
  this.client.mget(['accessToken', 'refreshToken', 'createdAt', 'expiresIn'], function(err, reply) {
    if (err) {
      console.error(err);
    } else {
      var token = {
        accessToken: reply[0],
        refreshToken: reply[1],
        createdAt: parseFloat(reply[2]),
        expiresIn: parseFloat(reply[3]),
        expiresAt: new Date((parseFloat(reply[2]) + parseFloat(reply[3]) ) * 1000 )
      }
      if (new Date() > token.expiresAt){
        that.refresh(function(token) {
          callback(token);
        })
      }else{
        callback(token);
      }
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
      .then(function (token){
        that.setToken(token, function() {
          callback(token)
        })
      })
      .catch(function (err){
        console.error(err)
      });
  });
}

module.exports = Auth;
