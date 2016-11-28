"use strict"

const Sml = require('../libs/Sml')


function Reading(rawSml) {
    let energyMilliwattHour
    let powerMilliwatt

    if (rawSml.indexOf("ESY5Q3") >= 0) {
        let sml = new Sml(rawSml)
        this.manufacturerName = 'easy_meter'
        this.productName = '5q3'
        this.meterSerialnumber = sml.valueByObisId('1-0:0.0.0')
        energyMilliwattHour = sml.energyMilliwattHour(['1-0:1.8.0', '1-0:2.8.0'], [0, -4], 1000 * 1000)

        if (rawSml.indexOf("V3.02") >= 0) {
            powerMilliwatt = sml.powerMilliwatt(['1-0:21.7.255', '1-0:41.7.255', '1-0:61.7.255'], [0, -2], 1000)
        }

        if (rawSml.indexOf("V3.04") >= 0) {
            powerMilliwatt = sml.powerMilliwatt(['1-0:21.7.0', '1-0:41.7.0', '1-0:61.7.0'], [0, -2], 1000)
        }

        this.energyAMilliwattHour = energyMilliwattHour[0]
        this.energyBMilliwattHour = energyMilliwattHour[1]
        this.powerAMilliwatt = powerMilliwatt.a
        this.powerBMilliwatt = powerMilliwatt.b
        this.direction = sml.direction

    } else if (rawSml.indexOf("ESY5T3") >= 0) {
        let sml = new Sml(rawSml)
        this.manufacturerName = 'easy_meter'
        this.productName = '5t3'
        this.meterSerialnumber = sml.valueByObisId('1-0:0.0.0')
        energyMilliwattHour = sml.energyMilliwattHour(['1-0:1.8.0', '1-0:2.8.0'], [0, -4], 1000 * 1000)
        powerMilliwatt = sml.powerMilliwatt(['1-0:21.7.0', '1-0:41.7.0', '1-0:61.7.0'], [0, -2], 1000)
        this.energyAMilliwattHour = energyMilliwattHour[0]
        this.energyBMilliwattHour = energyMilliwattHour[1]
        this.powerAMilliwatt = powerMilliwatt.a
        this.powerBMilliwatt = powerMilliwatt.b
        this.direction = sml.direction

    } else if (rawSml.indexOf("HAG5eHZ") >= 0) {
        let sml = new Sml(rawSml)
        this.manufacturerName = 'hager'
        this.productName = 'ehz'
        this.meterSerialnumber = sml.valueByObisId('0:0.0.0')
        energyMilliwattHour = sml.energyMilliwattHour(['1-0:1.8.1', '1-0:2.8.1'], null, 1000 * 1000)
        powerMilliwatt = sml.powerMilliwatt(['1-0:21.7.0', '1-0:41.7.0', '1-0:61.7.0'], [0, -2], 1000)
        this.energyAMilliwattHour = energyMilliwattHour[0]
        this.energyBMilliwattHour = energyMilliwattHour[1]
        this.powerAMilliwatt = powerMilliwatt.a
        this.powerBMilliwatt = powerMilliwatt.b
        this.direction = sml.direction
    } else {}
}



Reading.prototype.valid = function() {
    if (this.manufacturerName && this.meterSerialnumber && this.direction) {
        return true
    } else {
        return false
    }
}


module.exports = Reading
