"use strict"

const request = require('./request')
const async = require('async')
const Auth = require('./Auth')
const Reading = require('./Reading')
const redis = require('./redis')

let reading

const setup = {
    init: function(rawSML) {
        return new Promise((resolve, reject) => {
            reading = new Reading(rawSML)
            const auth = new Auth()
            auth.loggedIn()
                .then(
                    token => findOrCreateMeter(),
                    reject
                )
                .then(resolve, reject)
        })
    }
}

function findOrCreateMeter() {
    return new Promise((resolve, reject) => {
        findMeter()
            .then(
                meter => resolve(meter),
                rejected => createMeter()
            )
            .then(resolve, reject)
    })
}

function findMeter() {
    return new Promise((resolve, reject) => {
        redis.multi().mget('token', 'user').execAsync()
            .then(
                records => [].concat.apply([], records)
            )
            .then(
                records => {
                    let token = JSON.parse(records[0])
                    let user = JSON.parse(records[1])
                    return request.findMeter(token, user, reading)
                }
            )
            .then(
                meters => {
                    if (meters.length > 0) {
                        let meter = meters[0]
                        redis.setAsync("meter", JSON.stringify(meter))
                        resolve(meter)
                    } else {
                        reject('no meter fround for user')
                    }
                },
                reject
            )
    })
}

function createMeter() {
    return new Promise((resolve, reject) => {
        redis.getAsync('token')
            .then(
                token => {
                    return request.createMeter(token, reading)
                },
                reject
            )
            .then(
                meter => {
                    redis.setAsync("meter", meter)
                    resolve(meter)
                },
                reject
            )
            .then(
                meter => {
                    async.parallel([
                        function(done) {
                            if (reading.direction == 'in' || reading.direction == 'in_out') {
                                createRegister('in')
                                    .then(
                                        register => done(null, register),
                                        error => done(new Error(error))
                                    )
                            } else {
                                done(null, null)
                            }
                        },
                        function(done) {
                            if (reading.direction == 'out' || reading.direction == 'in_out') {
                                createRegister('in')
                                    .then(
                                        register => done(null, register),
                                        error => done(new Error(error))
                                    )
                            } else {
                                done(null, null)
                            }
                        }
                    ], function(err, results) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(meter)
                        }
                    })
                },
                reject
            )
    })
}

function createRegister(mode) {
    return new Promise((resolve, reject) => {
        redis.multi().mget('token', 'meter').execAsync()
            .then(
                records => [].concat.apply([], records)
            )
            .then(
                records => {
                    let token = JSON.parse(records[0])
                    let meter = JSON.parse(records[1])
                    return request.createRegister(token, meter, mode)
                }
            )
            .then(
                register => {
                    redis.setAsync(mode + "Register", JSON.stringify(register))
                    resolve(register)
                },
                reject
            )
    })
}









module.exports = setup
