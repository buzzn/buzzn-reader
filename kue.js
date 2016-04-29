var kue = require('kue');
var jobs = kue.createQueue();
var rest = require('restler');
var redis = require('redis');
var redisClient = redis.createClient();

jobs.process('reading', function(job, done) {
  var smlParser = new SmlParser(job.data.sml);
  redisClient.mget(['token'], function(err, reply) {
    rest.post('https://staging.buzzn.net/api/v1/readings',{
      accessToken: reply[0],
      data: {
        timestamp: Date(job.created_at*1000),
        meter_serialnumber: smlParser.meterSerialnumber,
        watt_hour_a: smlParser.wattHourA,
        watt_hour_b: smlParser.wattHourB,
        power: smlParser.power
      },
    }).on('success', function(data, response) {
      console.log('success')
    }).on('fail', function(data, response) {
      console.log("Fail:", data )
    }).on('error', function(err, response) {
      console.log('Error:', err);
    });
  });
  done();
});
