var kue = require('kue');
var jobs = kue.createQueue();

jobs.process('txt', function(job, done) {
  console.log(job.data);

  redis.get('token', function(err, token) {
    rest.post('https://staging.buzzn.net/api/v1/readings',{
      accessToken: token,
      data: {
        id: 334
      }
    });
  });
  done();
});
