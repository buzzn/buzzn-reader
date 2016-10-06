const config = require('config');
const Worker = require('./libs/Worker')
const Kue = require('kue');
const queue = Kue.createQueue({
  redis: { host: config.get('redis.host') }
});

queue.process('sml', function(job, done) {
  new Worker(job, done)
});

// not tested
// process.once('SIGTERM', function ( sig ) {
//   queue.shutdown( 5000, function(err) {
//     console.log( 'Kue shutdown: ', err||'' );
//     process.exit( 0 );
//   });
// });
