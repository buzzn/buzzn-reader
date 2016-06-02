var kue = require('kue');
var jobs = kue.createQueue();
var rest = require('restler');
var redis = require('redis');
var redisClient = redis.createClient();
var SmlParser = require('./libs/sml_parser');

jobs.process('sml', function(job, done) {
  var sml = new SmlParser(job.data.sml);

  redisClient.mget(['host', 'token', 'meterId', 'userId'], function(err, reply) {
    var host    = reply[0];
    var token   = reply[1];
    var meterId = reply[2];
    var userId  = reply[3];

    if(meterId == '' || meterId == undefined){
      console.log('No meterId available')
      console.log('call ' + host + "/api/v1/users/" + userId + "/meters api" + ' for users meter information with serialnumber ' + sml.meterSerialnumber)
      rest.get(host + "/api/v1/users/" + userId + "/meters", {
        accessToken: token,
        data: {
          manufacturer_product_serialnumber: sml.meterSerialnumber
        },
      }).on('success', function(data, response) {
        if(data['data'].length > 0){
          console.log('meter already exist')
          console.log('save meterId ' + data['data']['id'])
          redisClient.set('meterId', data['data']['id']);
          done();
        }else {
          console.log("no meter with serialnumber found in user account"  + sml.meterSerialnumber)
          console.log('create meter')
          rest.post(host + "/api/v1/meters", {
            accessToken: token,
            data: {
              manufacturer_name: sml.manufacturerName,
              manufacturer_product_name: sml.productName,
              manufacturer_product_serialnumber: sml.meterSerialnumber,
              smart: true
            },
          }).on('success', function(data, response) {
            console.log("meter created")
            console.log('save meterId ' + data['data']['id'])
            redisClient.set('meterId', data['data']['id']);
            done();
          }).on('fail', function(data, response) {
            done(data);
          }).on('error', function(err, response) {
            done(err);
          });
        }
        done();
      }).on('fail', function(data, response) {
        console.log('fail');
        done(data);
      }).on('error', function(err, response) {
        console.log('error: ');
        done(err);
      });

    } else {
      rest.post(host + "/api/v1/readings", {
        accessToken: token,
        data: {
          timestamp: new Date(parseInt(job.created_at)),
          meter_id: meterId,
          energy_a_milliwatt_hour: sml.energyAMilliwattHour,
          energy_b_milliwatt_hour: sml.energyBMilliwattHour,
          power_milliwatt: sml.powerMilliwatt
        },
      }).on('success', function(data, response) {
        console.log(data);
        done();
      }).on('fail', function(data, response) {
        console.log('fail: ' + JSON.stringify(data));
        done(data);
      }).on('error', function(err, response) {
        console.log('error');
        done(err);
      });
    }
  });

});
