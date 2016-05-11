var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var kue = require('kue');
var queue = kue.createQueue();

var port = new SerialPort('/dev/ttyUSB0', {
  parser: serialport.parsers.readline('!')
});

port.on('data', function (data) {
  queue.create('sml', { sml: data }).save();
});
