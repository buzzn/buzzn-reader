'use strict';

const config = require('config')
const SerialPort = require('serialport')
const Kue = require('kue')

let jobs = Kue.createQueue({
    redis: {
        host: config.get('redis.host')
    }
})

let port = new SerialPort('/dev/ttyUSB0', {
    dataBits: 7
})

let readLine = SerialPort.parsers.ReadLine;
let parser = port.pipe(readLine({
    delimiter: '!'
}))

parser.on('data', function(data) {
    jobs.create('sml', {
        sml: data
    }).removeOnComplete(true).save()
})
