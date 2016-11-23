"use strict"

function Sml(rawSml) {
    this.rawSml = rawSml

    const regex = /([0-9-:.]+)\*(?:[0-9]+)\((.*)\)/g
    let m
    let object = {}
    while (m = regex.exec(this.rawSml)) {
        object[m[1]] = m[2]
    }
    this.sml = object
}


Sml.prototype.valueByObisId = function(obisId) {
    if (Object.keys(this.sml).indexOf(obisId) >= 0)
        return this.sml[obisId]
    else
        return null
}


Sml.prototype.energyMilliwattHour = function(obisIds, slice, multiply) {
    let energies = []
    for (const index in obisIds) {
        let energy = this.valueByObisId(obisIds[index])
        if (energy) {
            let _energy = undefined
            if (slice) {
                _energy = energy.slice(slice[0], slice[1])
            } else {
                _energy = energy
            }
            if (multiply) {
                _energy = _energy * multiply
            }
            _energy = Math.round(_energy) // HACK javascript multiply problem
            energies.push(_energy)
        } else {
            energies.push(null)
        }
    }
    this.energies = energies
    return energies
}


Sml.prototype.powerMilliwatt = function(obisIds, slice, multiply) {
    if (obisIds.every(elem => this.sml[elem] != null)) {

        var powerMilliwatt = 0
        for (const obisId in obisIds) {
            powerMilliwatt += parseFloat(this.sml[obisIds[obisId]].slice(slice)) * multiply
        }

        if (powerMilliwatt >= 0 && this.energies[1] == null) {
            this.direction = 'in'
            var powerAMilliwatt = powerMilliwatt
            var powerBMilliwatt = null

        } else if (powerMilliwatt <= 0 && this.energies[1] == null) {
            this.direction = 'out'
            var powerAMilliwatt = Math.abs(powerMilliwatt)
            var powerBMilliwatt = null

        } else if (this.energies[0] != null && this.energies[1] != null) {
            this.direction = 'in_out'
            if (powerMilliwatt >= 0) {
                var powerAMilliwatt = powerMilliwatt
                var powerBMilliwatt = 0
            } else {
                var powerAMilliwatt = 0
                var powerBMilliwatt = Math.abs(powerMilliwatt)
            }
        } else {
            this.direction = null
            var powerAMilliwatt = null
            var powerBMilliwatt = null
        }

        return {
            a: powerAMilliwatt,
            b: powerBMilliwatt
        }

    } else {
        return {
            a: null,
            b: null
        }
    }
}

module.exports = Sml
