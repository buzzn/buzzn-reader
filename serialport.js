var serialport = require("serialport");
var SerialPort = require("serialport").SerialPort;
var kue = require('kue');
var queue = kue.createQueue();

//var serialPort = new SerialPort("/dev/ttyAMA0", { baudrate: 9600, dataBits: 7, stopBits: 1, bufferSize : 700 });
var serialPort = new SerialPort("/dev/ttyUSB0", {baudrate: 9600, databits: 7, stopbits:1, parity:'none', buffersize:1024, parser: serialport.parsers.raw});
var chunk = "";
var Length=800;


serialPort.on('data', function(data) {
//   chunk += data.toString('hex');
   chunk += data.toString();
   var regExp = /\s+/g;
//   chunk = chunk.replace(regExp,"");
   if(chunk.length < Length)
     return;
   if(Length == 800)
   {
      var pos1ofSlash = chunk.indexOf("/");
      var sliceChunk  = chunk.slice(100);
      var pos2ofSlash = sliceChunk.indexOf("/");
      
      Length = pos2ofSlash - pos1ofSlash + 100;

      queue.create('reading', { reading: Length.toString() }).save();
      return;
   }  

//   chunk += "XXXXXXXXXXXx";
   queue.create('reading', { reading: chunk.toString() + " *** " + Length.toString() }).save();
//  queue.create('reading', { reading: data.toString() }).save();
//  queue.create('reading', { reading: "Bezug: " + arr1_8_0[1] + " kW\n" +
//  "Einspeisung: " + int2_8_0 + " kW\n" +
//  "Leistung: " + arr15_7_0[1] + " W\n" }).save();
     chunk = "";

});
