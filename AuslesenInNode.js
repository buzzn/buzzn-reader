var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 9600, dataBits: 7, stopBits: 1, bufferSize : 700
}); // this is the openImmediately flag [default is true] 

var Auslese = ""
serialPort.on('data', function(data) {
    console.log(data.toString());}
);

////////serialPort.open(function (error) {
////////  if ( error ) {
////////    console.log('failed to open: '+error);
////////  } else {
////////    console.log('open');
////////    serialPort.on('data', function(data) {
////////      console.log('data received: ' + data);
////////    });
////////    serialPort.write("ls\n", function(err, results) {
////////      console.log('err ' + err);
////////      console.log('results ' + results);
////////    });
////////  }
////////});
