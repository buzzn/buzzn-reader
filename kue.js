var kue = require('kue');
var jobs = kue.createQueue();
var rest = require('restler');
var redis = require('redis');
var redisClient = redis.createClient();
var SmlParser = require('./libs/sml_parser');

jobs.process('sml', function(job, done) {
  var smlParser = new SmlParser(job.data.sml);

  redisClient.mget(['host', 'token', 'meterId'], function(err, reply) {
    var host    = reply[0];
    var token   = reply[1];
    var meterId = reply[2];

    if(meterId == null){
      rest.post(host + "/api/v1/meters", {
        accessToken: token,
        data: {
          manufacturer_name: smlParser.manufacturerName,
          manufacturer_product_name: smlParser.productName,
          manufacturer_product_serialnumber: smlParser.meterSerialnumber,
          smart: true
        },
      }).on('success', function(data, response) {
        redisClient.set('meterId', data['data']['id']);
        done();
      }).on('fail', function(data, response) {
        done(data);
      }).on('error', function(err, response) {
        done(err);
      });

    } else {
        console.log("token: " + token + "meterId: " + meterId)
      // rest.post(host + "/api/v1/readings", {
      //   accessToken: token,
      //   data: {
      //     timestamp: Date(job.created_at),
      //     meter_id: meterId,
      //     energy_a_milliwattHour: smlParser.energyAMilliwattHour,
      //     energy_b_milliwattHour: smlParser.energyBMilliwattHour,
      //     power_milliwatt: smlParser.powerMilliwatt
      //   },
      // }).on('success', function(data, response) {
      //   done();
      // }).on('fail', function(data, response) {
      //   done(data);
      // }).on('error', function(err, response) {
      //   done(err);
      // });
    }
  });

});
