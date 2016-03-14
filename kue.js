var kue = require('kue');
var jobs = kue.createQueue();
var rest = require('restler');
var redis = require('redis');

var redisClient = redis.createClient();

jobs.process('reading', function(job, done) {
  var reading = job.data.reading;

  redisClient.get('token', function(err, token) {
    rest.post('http://localhost:3001/api/v1/readings',{
      accessToken: token,
      data: {
        reading: reading
      }
    });
  });
  done();
});
