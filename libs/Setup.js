const request = require('./request')
const async = require('async')
const Auth = require('./Auth')
const Reading = require('./Reading')
const redis = require('./redis')

const auth = new Auth()

let reading, accessToken

function Setup(rawSML) {
    reading = new Reading(rawSML)
}

Setup.prototype.init = function(callback) {
    return new Promise((resolve, reject) => {
        auth.loggedIn()
            .then(
                resolved => {
                    findOrCreateMeter((error, meter) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(meter)
                        }
                    })
                },
                reject
            )
    })
}


function findOrCreateMeter(callback) {
    findMeter((error, meter) => {
        if (error) {
            if (error.message == 'no meter found') {
                createMeter((error, meter) => {
                    if (error) {
                        callback(error)
                    } else {
                        async.parallel([
                            function(callback) {
                                if (reading.direction == 'in' || reading.direction == 'in_out') {
                                    createRegister('in', (error, register) => {
                                        if (error) {
                                            callback(new Error(error))
                                        } else {
                                            callback(null, register)
                                        }
                                    })
                                } else {
                                    callback(null, null)
                                }
                            },
                            function(callback) {
                                if (reading.direction == 'out' || reading.direction == 'in_out') {
                                    createRegister('out', (error, register) => {
                                        if (error) {
                                            callback(new Error(error))
                                        } else {
                                            callback(null, register)
                                        }
                                    })
                                } else {
                                    callback(null, null)
                                }
                            }
                        ], function(err, results) {
                            if (err) {
                                callback(new Error(err))
                            } else {
                                callback(null, meter)
                            }
                        })
                    }
                })
            } else {
                callback(error)
            }
        } else {
            callback(null, meter)
        }
    })
}


function createMeter(callback) {
    redis.get('token', (err, record) => {
        if (err) {
            callback(new Error(err))
        } else {
            let token = JSON.parse(record)
            request.createMeter(token, reading)
                .then(
                    meter => {
                        redis.setAsync("meter", meter)
                        callback(null, meter)
                    },
                    rejected => {
                        callback(rejected)
                    }
                )
        }
    })
}

function findMeter(callback) {
    redis.mget(['user', 'token'], function(error, reply) {
        if (error) {
            console.error(error)
        } else {
            let user = JSON.parse(reply[0])
            let token = JSON.parse(reply[1])
            request.userMeters(token, user, reading)
                .then(
                    meter => {
                        redis.setAsync("meter", meter)
                        callback(null, meter)
                    },
                    rejected => {
                        callback(new Error('no meter found'))
                    }
                )
        }
    })
}

function findOrCreateRegister(callback) {
    findRegister((error, register) => {
        if (error) {
            callback(error.message);
        } else {

        }
    })
}


function createRegister(mode, callback) {
    redis.mget(['token', 'meter'], function(err, reply) {
        if (err) {
            callback(new Error(err))
        } else {
            let token = JSON.parse(reply[0])
            let meter = JSON.parse(reply[1])
            request.createRegister(token, meter, mode)
                .then(
                    register => {
                        redis.setAsync("register" + mode, register)
                        return register
                    },
                    rejected => {
                        callback(new Error(rejected))
                    }
                ).then(
                    register => {
                        callback(null, register)
                    },
                    rejected => {
                        callback(rejected)
                    }
                )
        }
    })
}

function findRegister(mode, callback) {
    redis.mget(['user', 'token', 'meter'], function(err, reply) {
        if (err) {
            console.error(err)
        } else {
            let user = JSON.parse(reply[0])
            let token = JSON.parse(reply[1])
            let meter = JSON.parse(reply[2])
            request.findRegister(token, meter, mode)
                .then(
                    register => {
                        redis.setAsync("register" + mode, register)
                        return register
                    },
                    reject
                ).then(
                    register => {
                        callback(null, register)
                    },
                    rejected => {
                        callback(rejected)
                    }
                )
        }
    })
}






module.exports = Setup
