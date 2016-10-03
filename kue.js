const config = require('config');
const Kue = require('kue');
const request = require('superagent');
const Auth = require('./libs/Auth');
const Reading = require('./libs/Reading');

const jobs = Kue.createQueue({ redis: { host: config.get('redis.host') }});

jobs.process('sml', function(job, done) {
  let reading = new Reading(job.data.sml)
  let auth = new Auth()
  auth.loggedIn(function(token){

    if(token && reading.valid){
      accessToken = token.accessToken

      request
        .post('https://app.buzzn.net' + '/api/v1/readings')
        .send({
          timestamp: new Date(parseInt(job.created_at)),
          meter_id: meterId,
          energy_a_milliwatt_hour: reading.energyAMilliwattHour,
          energy_b_milliwatt_hour: reading.energyBMilliwattHour,
          power_a_milliwatt: reading.powerAMilliwatt,
          power_b_milliwatt: reading.powerBMilliwatt
        })
        .end(function(err, res){
          if (err || !res.ok) {
            done(err);
          } else {
            done();
          }
        });

    }else{
      done('not loggedIn');
    }
  })

});
