const config = require('config');
const request = require('superagent')
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
            request
                .post(config.get('buzzn.host') + '/api/v1/meters')
                .set('Authorization', 'Bearer ' + token.access_token)
                .send({
                    manufacturer_name: reading.manufacturerName,
                    manufacturer_product_name: reading.productName,
                    manufacturer_product_serialnumber: reading.meterSerialnumber,
                    smart: true
                })
                .end(function(err, res) {
                    if (err || !res.ok) {
                        let firstError = err.response.body.errors[0] // really ugly
                        callback(new Error(firstError.detail))
                    } else {
                        let meter = JSON.stringify(res.body.data)
                        redis.set("meter", meter, function(err, reply) {
                            if (err) {
                                callback(new Error(err))
                            } else {
                                callback(null, meter)
                            }
                        })
                    }
                })
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
            request
                .get(config.get('buzzn.host') + '/api/v1/users/' + user.id + '/meters')
                .set('Authorization', 'Bearer ' + token.access_token)
                .query({
                    filter: reading.meterSerialnumber
                })
                .end(function(err, res) {
                    if (err || !res.ok) {
                        callback(new Error(err))
                    } else {
                        if (res.body.data.length > 0) {
                            let meter = JSON.stringify(res.body.data[0])
                            redis.set("meter", meter, function(err, reply) {
                                if (err) {
                                    callback(new Error(err))
                                } else {
                                    callback(null, meter)
                                }
                            })
                        } else {
                            callback(new Error('no meter found'))
                        }

                    }
                })
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
            request
                .post(config.get('buzzn.host') + '/api/v1/registers')
                .set('Authorization', 'Bearer ' + token.access_token)
                .send({
                    name: mode + 'put',
                    mode: mode,
                    meter_id: meter.id,
                    readable: 'friends'
                })
                .end(function(err, res) {
                    if (err || !res.ok) {
                        console.log(err);
                        let firstError = err.response.body.errors[0] // really ugly
                        callback(new Error(firstError.detail))
                    } else {
                        let register = JSON.stringify(res.body.data)
                        redis.set(mode + "Register", register, function(err, reply) {
                            if (err) {
                                callback(new Error(err))
                            } else {
                                callback(null, register)
                            }
                        })
                    }
                })
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
            request
                .get(config.get('buzzn.host') + '/api/v1/meters/' + meter.id + '/registers')
                .set('Authorization', 'Bearer ' + token.access_token)
                .query({
                    filter: mode
                })
                .end(function(err, res) {
                    if (err || !res.ok) {
                        callback(new Error(err))
                    } else {
                        if (res.body.data.length > 0) {
                            let meter = JSON.stringify(res.body.data[0])
                            redis.set("meter", meter, function(err, reply) {
                                if (err) {
                                    callback(new Error(err))
                                } else {
                                    callback(null, meter)
                                }
                            })
                        } else {
                            callback(new Error('no meter found'))
                        }
                    }
                })

        }
    })
}






module.exports = Setup
