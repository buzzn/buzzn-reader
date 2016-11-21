const config = require('config');
const request = require('./request');
const Auth = require('./Auth');
const setup = require('./setup');
const Reading = require('./Reading');
const Time = require('time');

const redis = require('./redis')
const queue = require('./queue');

function Worker(job, done) {
    let reading = new Reading(job.data.sml)
    if (reading.valid()) {

        redis.get('meter', (error, record) => {
            if (error) {
                done(error);
            } else {
                let meter = JSON.parse(record)
                if (meter) {
                    let auth = new Auth()
                    auth.getToken()
                        .then(
                            token => {
                                let timestamp = new Time.Date(parseInt(job.created_at), 'UTC').toString()
                                return request.createReading(token, meter, reading, timestamp)
                            },
                            rejected => done(error)
                        )
                        .then(
                            reading => done(null, reading),
                            error => done(error)
                        )
                } else {
                    setup.init(job.data.sml)
                        .then(
                            resolved => done(null, resolved),
                            error => done(error)
                        )
                }
            }
        })
    } else {
        done();
    }
}


module.exports = Worker;
