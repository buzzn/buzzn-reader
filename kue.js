var kue = require('kue');
var jobs = kue.createQueue();
var rest = require('restler');
var redis = require('redis');
var redisClient = redis.createClient();
var SmlParser = require('./libs/sml_parser');

jobs.process('sml', function(job, done) {
  var smlParser = new SmlParser(job.data.sml);

  redisClient.mget(['host', 'token', 'meterId', 'userId'], function(err, reply) {
    var host    = reply[0];
    var token   = reply[1];
    var meterId = reply[2];
    var userId  = reply[3];

    if(meterId == '' || meterId == undefined){

      rest.get(host + "/api/v1/users/" + userId + "/meters", {
        accessToken: token,
        data: {
          manufacturer_product_serialnumber: smlParser.meterSerialnumber
        },
      }).on('success', function(data, response) {
        if(data['data'].length > 0){
          console.log(data['data'])
        }else {
          console.log("no meter found: "  + smlParser.meterSerialnumber)
          rest.post(host + "/api/v1/meters", {
            accessToken: token,
            data: {
              manufacturer_name: smlParser.manufacturerName,
              manufacturer_product_name: smlParser.productName,
              manufacturer_product_serialnumber: smlParser.meterSerialnumber,
              smart: true
            },
          }).on('success', function(data, response) {
            console.log("created meter: " + data['data']['id'])
            redisClient.set('meterId', data['data']['id']);
            done();
          }).on('fail', function(data, response) {
            console.log('fail: ' + data);
            done(data);
          }).on('error', function(err, response) {
            console.log('error');
            done(err);
          });
        }
        done();
      }).on('fail', function(data, response) {
        console.log('fail');
        done(data);
      }).on('error', function(err, response) {
        console.log('error');
        done(err);
      });


      // rest.post(host + "/api/v1/meters", {
      //   accessToken: token,
      //   data: {
      //     manufacturer_name: smlParser.manufacturerName,
      //     manufacturer_product_name: smlParser.productName,
      //     manufacturer_product_serialnumber: smlParser.meterSerialnumber,
      //     smart: true
      //   },
      // }).on('success', function(data, response) {
      //   redisClient.set('meterId', data['data']['id']);
      //   done();
      // }).on('fail', function(data, response) {
      //   console.log('fail');
      //   done(data);
      // }).on('error', function(err, response) {
      //   console.log('error');
      //   done(err);
      // });

    } else {
      console.log("token: " + token + "meterId: " + meterId)
      done();
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
      //   console.log(data);
      //   done();
      // }).on('fail', function(data, response) {
      //   console.log('fail');
      //   done(data);
      // }).on('error', function(err, response) {
      //   console.log('error');
      //   done(err);
      // });
    }
  });

});
