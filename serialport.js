const config = require('config');
const SerialPort = require('serialport');
const Kue = require('kue');
const ReadLine = SerialPort.parsers.ReadLine;
const jobs = Kue.createQueue({ redis: { host: config.get('redis.host') }});

let port = new SerialPort('/dev/ttyUSB0', { databits: 7 });
var parser = port.pipe(new ReadLine('!'));

parser.on('data', function (data) {
  jobs.create('sml', { sml: data }).removeOnComplete( true ).save()
});
