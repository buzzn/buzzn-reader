'use strict';
require('dotenv').config()
const SerialPort = require('serialport')
const mqtt = require('mqtt')
const Reading = require('./libs/Reading')

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_HOST)
mqttClient.on('connect', () => {
  mqttClient.subscribe(process.env.MQTT_TOPIC)
  let port = new SerialPort('/dev/ttyUSB0', {dataBits: 7})
  let readLine = SerialPort.parsers.ReadLine;
  let parser = port.pipe(readLine({delimiter: '!'}))
  parser.on('data', function(data) {
    let reading = new Reading(data.sml)
    if (reading.valid()) {
      let reading = {
        meterSerialnumber: meter.meterSerialnumber,
        energyAMilliwattHour: reading.energyAMilliwattHour,
        energyBMilliwattHour: reading.energyBMilliwattHour,
        powerAMilliwatt: reading.powerAMilliwatt,
        powerBMilliwatt: reading.powerBMilliwatt
      }
      mqttClient.publish(process.env.MQTT_TOPIC, reading.toString())
    }
  })
})
