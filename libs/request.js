"use strict"

const config = require('config');
const superagent = require('superagent')

const request = {
    oauthToken: function(options) {
        return new Promise((resolve, reject) => {
            superagent
                .post(config.get('buzzn.host') + '/oauth/token')
                .send(options)
                .end(function(err, res) {
                    if (err || !res.ok) {
                        reject(res.body)
                    } else {
                        resolve(JSON.stringify(res.body))
                    }
                })
        })
    },

    oauthRevoke: function(token) {
        return new Promise((resolve, reject) => {
            superagent
                .post(config.get('buzzn.host') + '/oauth/revoke')
                .set('Authorization', 'Bearer ' + token.access_token)
                .send({
                    token: token.access_token,
                })
                .end((err, res) => {
                    if (err || !res.ok) {
                        console.log(err);
                        reject(res.body)
                    } else {
                        resolve(JSON.stringify(res.body))
                    }
                })
        })
    },

    usersMe: function(token) {
        return new Promise((resolve, reject) => {
            superagent
                .get(config.get('buzzn.host') + '/api/v1/users/me')
                .set('Authorization', 'Bearer ' + token.access_token)
                .end((err, res) => {
                    if (err || !res.ok) {
                        reject(res.body)
                    } else {
                        resolve(JSON.stringify(res.body.data))
                    }
                })
        })
    },

    createMeter: function(token, reading) {
        return new Promise((resolve, reject) => {
            superagent
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
                        reject(new Error(firstError.detail))
                    } else {
                        let meter = JSON.stringify(res.body.data)
                        resolve(meter)
                    }
                })
        })
    },


    findMeter: function(token, user, reading) {
        return new Promise((resolve, reject) => {
            superagent
                .get(config.get('buzzn.host') + '/api/v1/users/' + user.id + '/meters')
                .set('Authorization', 'Bearer ' + token.access_token)
                .query({
                    filter: reading.meterSerialnumber
                })
                .end(function(err, res) {
                    if (err || !res.ok) {
                        reject(res.body)
                    } else {
                        resolve(res.body.data)
                    }
                })
        })
    },


    // findRegister: function(token, meter, mode) {
    //     return new Promise((resolve, reject) => {
    //         superagent
    //             .get(config.get('buzzn.host') + '/api/v1/meters/' + meter.id + '/registers')
    //             .set('Authorization', 'Bearer ' + token.access_token)
    //             .query({
    //                 filter: mode
    //             })
    //             .end(function(err, res) {
    //                 if (err || !res.ok) {
    //                     reject(res.body)
    //                 } else {
    //                     if (res.body.data.length > 0) {
    //                         let register = JSON.stringify(res.body.data[0])
    //                         resolve(register)
    //                     } else {
    //                         reject('no register found')
    //                     }
    //                 }
    //             })
    //     })
    // },

    createRegister: function(token, meter, mode) {
        return new Promise((resolve, reject) => {
            superagent
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
                        let firstError = err.response.body.errors[0] // really ugly
                        reject(new Error(firstError.detail))
                    } else {
                        let register = JSON.stringify(res.body.data)
                        resolve(register)
                    }
                })
        })
    },

    createReading: function(token, meter, reading, timestamp) {
        return new Promise((resolve, reject) => {
            superagent
                .post(config.get('buzzn.host') + '/api/v1/readings')
                .set('Authorization', 'Bearer ' + token.access_token)
                .send({
                    timestamp: timestamp,
                    meter_id: meter.id,
                    energy_a_milliwatt_hour: reading.energyAMilliwattHour,
                    energy_b_milliwatt_hour: reading.energyBMilliwattHour,
                    power_a_milliwatt: reading.powerAMilliwatt,
                    power_b_milliwatt: reading.powerBMilliwatt
                })
                .end((err, res) => {
                    if (err || !res.ok) {
                        reject(res.body)
                    } else {
                        let reading = res.body.data
                        resolve(reading)
                    }
                })
        })
    }


}

module.exports = request
