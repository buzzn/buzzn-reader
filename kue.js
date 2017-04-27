const Worker = require('./libs/Worker')
const queue = require('./libs/queue');

queue.process('sml', function(job, done) {
    new Worker(job, done)
})
