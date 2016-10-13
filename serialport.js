// const config = require('config')
const SerialPort = require('serialport')

// const Kue = require('kue')
// let jobs = Kue.createQueue({
//     redis: {
//         host: config.get('redis.host')
//     }
// })

let port = new SerialPort('/dev/ttyUSB0')

let ReadLine = SerialPort.parsers.ReadLine;
let parser = port.pipe(ReadLine({
    delimiter: '!'
}))

parser.on('data', function(data) {
    console.log(data);
    // jobs.create('sml', {
    //     sml: data
    // }).removeOnComplete(true).save()
})
