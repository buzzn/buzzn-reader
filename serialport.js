var SerialPort = require("serialport").SerialPort;
var kue = require('kue');
var queue = kue.createQueue();

var serialPort = new SerialPort("/dev/ttyAMA0", { baudrate: 9600, dataBits: 7, stopBits: 1, bufferSize : 700 });

serialPort.on('data', function(data) {
  queue.create('reading', { reading: data.toString() }).save();
});
