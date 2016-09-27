const request = require('superagent');
const Redis = require('redis');
const config = require('config');
const Auth = require('./Auth');
const Reading = require('./Reading');

const redis = Redis.createClient(6379, config.get('redis.host'));
const host = 'https://app.buzzn.net';
const auth = new Auth();

let reading, accessToken;

function Setup(rawSML) {
  reading = new Reading(rawSML);
}

Setup.prototype.init = function(callback) {
  auth.loggedIn(function(token){
    if(token){
      findOrCreateMeter(function(meter){
        callback(meter);
      })
    } else {
      callback(false)
    }
  })
}

function findOrCreateMeter(callback){
  findMeter(function(meter){
    if(meter){
      saveMeter(meter, function(reply){
        callback(meter)
      })
    }else{
      createMeter()
    }
  })
}

function saveMeter(meter, callback){
  redis.set("meter", meter, function (err, reply) {
    if (err){
      console.error(err);
    }else{
      callback(meter)
    }
  })
}

function createMeter(callback){
};

function findMeter(callback){
  redis.mget(['user', 'token'], function(err, reply) {
    if(err){
      console.error(err);
    } else {
      let user = JSON.parse(reply[0])
      let token = JSON.parse(reply[1])
      request
        .get(host + '/api/v1/users/' + user.data.id + '/meters')
        .set('Authorization', 'Bearer ' + token.access_token)
        .send({
          manufacturer_product_serialnumber: reading.meterSerialnumber
        })
        .end(function(err, res){
          if (err || !res.ok) {
            console.error(err.body);
          } else {
            let meter = JSON.stringify(res.body.data[0])

            redis.set("meter", meter, function (err, reply) {
              if(err){
                console.error(err);
              }else{
                callback(meter)
              }
            });
          }
        });
    }
  });
}


module.exports = Setup;
