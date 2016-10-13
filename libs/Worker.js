const config = require('config');
const request = require('superagent');
const Auth = require('./Auth');
const Setup = require('./Setup');
const Reading = require('./Reading');
const Time = require('time');
const Redis = require('redis');
let redis = Redis.createClient(6379, config.get('redis.host'));

const Kue = require('kue');
const queue = Kue.createQueue({
    redis: {
        host: config.get('redis.host')
    }
});

function Worker(job, done) {
    let reading = new Reading(job.data.sml)
    let auth = new Auth()
    auth.loggedIn((res) => {
        if (res && reading.valid()) {
            let token = JSON.parse(res)
            redis.get('meter', (err, record) => {
                if (err) {
                    console.error(err)
                } else {
                    if (record) {
                        let meter = JSON.parse(record);
                        request
                            .post('https://app.buzzn.net' + '/api/v1/readings')
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
                            });
                    } else {
                        done('noSetup. initSetup...')
                        let setup = new Setup(rawSML)
                        setup.init((error, response) => {
                            if (error) {
                                done(error)
                            } else {
                                done(null, response);
                            }
                        })
                    }
                }
            });
        } else {
            done('noAuth');
        }
    })
}

module.exports = Worker;
