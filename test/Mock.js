"use strict"

const config = require('config');
const nock = require('nock')
const sinon = require('sinon')
const Time = require('time');

let accessToken = 'accessaccessaccessaccessaccessaccessaccessaccessaccess'
let refreshToken = 'refreshrefreshrefreshrefreshrefreshrefreshrefreshrefresh'
let newAccessToken = 'newaccessnewaccessnewaccessnewaccessnewaccessnewaccess'
let newRefreshToken = 'newrefreshnewrefreshnewrefreshnewrefreshnewrefreshnewrefresh'
let userId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx'
let username = 'user@email.com'
let password = 'xxxxxxxx'
let options = {}
let date = new Time.Date(2016, 8, 20)
let clock

function Mock(options) {
    options = options || {};
    date.setTimezone('UTC')
    options.date = options.date || date
    clock = sinon.useFakeTimers(options.date.getTime())
}


Mock.prototype.oauthTokenViaPasswordInvalidGrant = function(options) {
    let response = {
        error: "invalid_grant",
        error_description: "The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client."
    }
    nock(config.get('buzzn.host'))
        .post('/oauth/token', {
            grant_type: 'password',
            username: username,
            password: password,
            scope: 'smartmeter',
        })
        .reply(401, response)

    return response
}


Mock.prototype.oauthTokenViaPassword = function() {
    let response = {
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: 7200,
        refresh_token: refreshToken,
        scope: 'smartmeter',
        created_at: new Date().getTime() / 1000
    }
    nock(config.get('buzzn.host'))
        .post('/oauth/token', {
            grant_type: 'password',
            username: username,
            password: password,
            scope: 'smartmeter',
        })
        .reply(200, response)
    return response
}


Mock.prototype.oauthTokenViaRefreshToken = function() {
    let response = {
        access_token: newAccessToken,
        token_type: 'bearer',
        expires_in: 7200,
        refresh_token: newRefreshToken,
        scope: 'smartmeter',
        created_at: new Date().getTime() / 1000
    }
    nock(config.get('buzzn.host'))
        .post('/oauth/token', {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
        .reply(200, response)
    return response
}


Mock.prototype.oauthRevoke = function() {
    let response = {}
    nock(config.get('buzzn.host'))
        .post('/oauth/revoke', {
            token: accessToken,
        })
        .reply(200, response)
    return response
}



Mock.prototype.usersMe = function() {
    let response = {
        data: {
            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            type: 'users',
            links: {
                self: 'https://app.buzzn.net/api/v1/users/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
            },
        }
    }
    nock(config.get('buzzn.host'))
        .get('/api/v1/users/me')
        .reply(200, response)

    return response
}


Mock.prototype.userMetersEmpty = function() {
    let response = {
        data: [],
        meta: {
            total_pages: 1
        }
    }
    nock(config.get('buzzn.host'))
        .get('/api/v1/users/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/meters')
        .query({
            filter: '60327685'
        })
        .reply(200, response)

    return response
}


Mock.prototype.userMeters = function() {
    let response = {
        data: [{
            id: 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm',
            type: 'meters',
            links: {
                self: 'https://app.buzzn.net/api/v1/meters/mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm'
            },
            attributes: {
                'manufacturer-name': 'easy_meter',
                'manufacturer-product-name': '5q3',
                'manufacturer-product-serialnumber': '60327685',
                smart: true,
                online: false
            }
        }],
        meta: {
            total_pages: 1
        }
    }
    nock(config.get('buzzn.host'))
        .get('/api/v1/users/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/meters')
        .query({
            filter: '60327685'
        })
        .reply(200, response)

    return response
}


Mock.prototype.createMeter = function() {
    let response = {
        data: {
            id: 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm',
            type: 'meters',
            links: {
                self: 'https://app.buzzn.net/api/v1/meters/mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm'
            },
            attributes: {
                'manufacturer-name': 'easy_meter',
                'manufacturer-product-name': '5q3',
                'manufacturer-product-serialnumber': '60327685',
                smart: true,
                online: false
            }
        }
    }
    nock(config.get('buzzn.host'))
        .post('/api/v1/meters', {
            manufacturer_name: 'easy_meter',
            manufacturer_product_name: '5q3',
            manufacturer_product_serialnumber: '60327685',
            smart: true
        })
        .reply(200, response)

    return response
}

Mock.prototype.createExistingMeter = function() {
    let response = {
        "errors": [{
            "source": {
                "pointer": "/data/attributes/manufacturer_product_serialnumber"
            },
            "title": "Invalid Attribute",
            "detail": "manufacturer_product_serialnumber ist bereits vergeben"
        }]
    }
    nock(config.get('buzzn.host'))
        .post('/api/v1/meters', {
            manufacturer_name: 'easy_meter',
            manufacturer_product_name: '5q3',
            manufacturer_product_serialnumber: '60327685',
            smart: true
        })
        .reply(422, response)

    return response
}

Mock.prototype.createRegister = function(mode) {
    let id = mode + "mpmpmp-mpmp-mpmp-mpmp-mpmpmpmpmpmp"
    let response = {
        "data": {
            "id": id,
            "type": "registers",
            "links": {
                "self": "https://app.buzzn.net/api/v1/registers/" + id
            },
            "attributes": {
                "uid": null,
                "name": mode + "put",
                "mode": "in",
                "meter-id": "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm",
                "readable": "friends"
            }
        }
    }
    nock(config.get('buzzn.host'))
        .post('/api/v1/registers', {
            name: mode + 'put',
            mode: mode,
            meter_id: "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm",
            readable: 'friends'
        })
        .reply(200, response)

    return response
}


Mock.prototype.createReading = function() {
    let response = {
        "data": {
            "id": "rrrrrrrrrrrrrrrrrrrrrrrrr",
            "type": "readings",
            "links": {
                "self": "https://app.buzzn.net/api/v1/readings/rrrrrrrrrrrrrrrrrrrrrrrrr"
            },
            "attributes": {
                "timestamp": date.toString(),
                "meter_id": "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm",
                "energy_a_milliwatt_hour": 640000,
                "energy_b_milliwatt_hour": null,
                "power_a_milliwatt": 2600,
                "power_b_milliwatt": null
            }
        }
    }
    nock(config.get('buzzn.host'))
        .post('/api/v1/readings', {
            timestamp: date.toString(),
            meter_id: "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm",
            energy_a_milliwatt_hour: 640000,
            energy_b_milliwatt_hour: null,
            power_a_milliwatt: 2600,
            power_b_milliwatt: null
        })
        .reply(200, response)

    return response
}




Mock.prototype.cleanAll = function() {
    nock.cleanAll()
    clock.restore()
}


module.exports = Mock
