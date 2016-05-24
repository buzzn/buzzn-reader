var kue = require('kue');
var jobs = kue.createQueue();
var rest = require('restler');
var redis = require('redis');
var redisClient = redis.createClient();
var SmlParser = require('./libs/sml_parser');

jobs.process('sml', function(job, done) {
  var smlParser = new SmlParser(job.data.sml);
  
  redisClient.mget(['host', 'token', 'meterId'], function(err, reply) {

    if(reply[2] == null){
      rest.post(reply[0] + "/api/v1/meters", {
        accessToken: reply[1],
        data: {
          manufacturer_name: smlParser.manufacturerName,
          manufacturer_product_name: smlParser.productName,
          manufacturer_product_serialnumber: smlParser.meterSerialnumber,
          smart: true
        },
      }).on('success', function(data, response) {
        redisClient.set('meterId', data['data']['id']);
        done();
      }).on('fail', function(data, response) {
        done(data);
      }).on('error', function(err, response) {
        done(err);
      });

    } else {
      rest.post(reply[0] + "/api/v1/readings", {
        accessToken: reply[1],
        data: {
          timestamp: Date(job.created_at),
          meter_id: reply[2],
          energy_a_milliwattHour: smlParser.energyAMilliwattHour,
          energy_b_milliwattHour: smlParser.energyBMilliwattHour,
          power_milliwatt: smlParser.powerMilliwatt
        },
      }).on('success', function(data, response) {
        done();
      }).on('fail', function(data, response) {
        done(data);
      }).on('error', function(err, response) {
        done(err);
      });
    }
  });

});
