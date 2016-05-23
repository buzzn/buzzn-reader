var kue = require('kue');
var jobs = kue.createQueue();
var rest = require('restler');
var redis = require('redis');
var redisClient = redis.createClient();
var SmlParser = require('./libs/sml_parser');

jobs.process('sml', function(job, done) {
  var smlParser = new SmlParser(job.data.sml);
  redisClient.mget(['host', 'token'], function(err, reply) {
    rest.post(reply[0],{
      accessToken: reply[1] + "/api/v1/readings",
      data: {
        timestamp: Date(job.created_at),
        meter_serialnumber: smlParser.meterSerialnumber,
        energy_a_milliwattHour: smlParser.energyAMilliwattHour,
        energy_b_milliwattHour: smlParser.energyBMilliwattHour,
        power_milliwatt: smlParser.powerMilliwatt
      },
    }).on('success', function(data, response) {
      done();
    }).on('fail', function(data, response) {
      console.log("Fail:", data )
    }).on('error', function(err, response) {
      console.log('Error:', err);
    });
  });
});
