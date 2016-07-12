var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var kue = require('kue');
var queue = kue.createQueue({ redis: { host: 'redis' }});

var port = new SerialPort('/dev/ttyUSB0', {
  databits: 7,
  parser: serialport.parsers.readline('!')
});

port.on('data', function (data) {
  queue.create('sml', { sml: data }).removeOnComplete( true ).save()
});
