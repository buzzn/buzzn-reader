var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var port = new SerialPort('/dev/tty-usbserial1', {
  parser: serialport.parsers.readline('\n')
});

port.on('data', function (data) {
  console.log('Data: ' + data);
});
