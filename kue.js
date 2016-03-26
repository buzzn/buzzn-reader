var kue = require('kue');
var jobs = kue.createQueue();
var rest = require('restler');
var redis = require('redis');

var redisClient = redis.createClient();

jobs.process('reading', function(job, done) {
  var reading = job.data.reading.replace(/\n|\r/g, "");

  var regex = /([0-9-:.]+)[^(]*\(([^)]+)\)/g;
  var m;
  var obis = {};
  while ((m = regex.exec(reading))) {
   obis[m[1]] = m[2];
  }

 var power = obis['1-0:61.7.0'];
 console.log(power);


  // redisClient.mget(['token', 'metering_point_id'], function(err, reply) {
  //   rest.post('https://staging.buzzn.net/api/v1/readings',{
  //     accessToken: reply[0],
  //     data: {
  //       metering_point_id: reply[1],
  //       timestamp: Date(job.created_at*1000)
  //     },
  //   }).on('success', function(data, response) {
  //     console.log('success')
  //   }).on('fail', function(data, response) {
  //     console.log("Fail:", data )
  //   }).on('error', function(err, response) {
  //     console.log('Error:', err);
  //   });
  // });
  done();
});
