var kue = require('kue');
var jobs = kue.createQueue();
var rest = require('restler');
var redis = require('redis');

var redisClient = redis.createClient();

var meter = "easymeter_q3d";

jobs.process('reading', function(job, done) {

  var reading = job.data.reading;
  var regex = /([0-9-:.]+)[^(]*\(([^)]+)\)/g;
  var m;
  var obis = {};
  while ((m = regex.exec(reading))) {
   obis[m[1]] = m[2];
  }

  switch(meter) {
    case "easymeter_q3d":
      var phaseOne   = parseFloat(obis['1-0:21.7.255'].slice(0,-2));
      var phaseTwo   = parseFloat(obis['1-0:41.7.255'].slice(0,-2));
      var phaseThree = parseFloat(obis['1-0:61.7.255'].slice(0,-2));
      var power = phaseOne + phaseTwo + phaseThree
      break;

    case "hager_ehz":
      var phaseOne   = parseFloat(obis['1-0:21.7.0'].slice(0,-2));
      var phaseTwo   = parseFloat(obis['1-0:41.7.0'].slice(0,-2));
      var phaseThree = parseFloat(obis['1-0:61.7.0'].slice(0,-2));
      var power = phaseOne + phaseTwo + phaseThree
      break;
  }



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
