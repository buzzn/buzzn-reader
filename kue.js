var kue = require('kue');
var jobs = kue.createQueue();
var rest = require('restler');
var redis = require('redis');
var redisClient = redis.createClient();
var SmlParser = require('libs/sml_parser');

jobs.process('sml', function(job, done) {
  var smlParser = new SmlParser(job.data.sml);
  redisClient.mget(['token'], function(err, reply) {
    rest.post('https://staging.buzzn.net/api/v1/readings',{
      accessToken: reply[0],
      data: {
        timestamp: Date(job.created_at*1000),
        watt_hour: smlParser.wattHourA,
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
