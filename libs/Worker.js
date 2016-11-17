const config = require('config');
const request = require('superagent');
const Auth = require('./Auth');
const Setup = require('./Setup');
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
                    auth.getToken((error, token) => {
                        if (error) {
                            done(error)
                        } else {
                            request
                                .post(config.get('buzzn.host') + '/api/v1/readings')
                                .set('Authorization', 'Bearer ' + token.access_token)
                                .send({
                                    timestamp: new Time.Date(parseInt(job.created_at), 'UTC').toString(),
                                    meter_id: meter.id,
                                    energy_a_milliwatt_hour: reading.energyAMilliwattHour,
                                    energy_b_milliwatt_hour: reading.energyBMilliwattHour,
                                    power_a_milliwatt: reading.powerAMilliwatt,
                                    power_b_milliwatt: reading.powerBMilliwatt
                                })
                                .end((err, res) => {
                                    if (err || !res.ok) {
                                        console.error(err);
                                        done(err);
                                    } else {
                                        done(null, res);
                                    }
                                })
                        }
                    })
                } else {
                    let setup = new Setup(job.data.sml)
                    setup.init((error, response) => {
                        if (error) {
                            done(error)
                        } else {
                            done(null, response);
                        }
                    })
                }

            }
        })


    } else {
        done();
    }


}

module.exports = Worker;
