const Worker = require('./libs/Worker')
const queue = require('./queue');

queue.process('sml', function(job, done) {
    new Worker(job, done)
})
