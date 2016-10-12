const Redis = require('redis')
const config = require('config')
const request = require('superagent')

let host = 'https://app.buzzn.net'
let redis = Redis.createClient(6379, config.get('redis.host'))

function Auth(host) {}

Auth.prototype.login = function(options, callback) {
    getTokenWithPassword(options, (token) => {
        if (token) {
            getUser((user) =>
                callback(user)
            )
        } else {
            callback(null)
        }
    })
}

function getTokenWithPassword(options, callback) {
    request
        .post(host + '/oauth/token')
        .send({
            grant_type: 'password',
            username: options.username,
            password: options.password,
            scope: 'smartmeter'
        })
        .end((err, res) => {
            if (err || !res.ok) {
                callback(err.body)
            } else {
                let token = JSON.stringify(res.body)
                redis.set("token", token, (err, reply) =>
                    callback(token)
                )
            }
        })
}

function getTokenWithRefreshToken(callback) {
    redis.get('token', (err, token) => {
        if (err) {
            console.error(err)
        } else {
            let _token = JSON.parse(token)
            request
                .post(host + '/oauth/token')
                .send({
                    grant_type: 'refresh_token',
                    refresh_token: _token.refresh_token
                })
                .end(function(err, res) {
                    if (err || !res.ok) {
                        console.error(err)
                    } else {
                        let token = JSON.stringify(res.body)
                        redis.set("token", token, function(err, reply) {
                            if (err) {
                                console.error(err)
                            } else {
                                callback(token)
                            }
                        })
                    }
                })
        }
    })
}

function getUser(callback) {
    redis.get('token', (err, record) => {
        if (err) {
            console.error(err)
        } else {
            let token = JSON.parse(record)
            request
                .get(host + '/api/v1/users/me')
                .set('Authorization', 'Bearer ' + token.access_token)
                .end((err, res) => {
                    if (err || !res.ok) {
                        console.error(err)
                    } else {
                        let user = JSON.stringify(res.body.data)
                        redis.set("user", user, (err, reply) => {
                            callback(user)
                        })
                    }
                })
        }
    })
}

Auth.prototype.logout = function(callback) {
    var that = this
    var _redis = redis,
        multi
    _redis.multi([
        ["del", "token"],
        ["del", "user"],
        ["del", "meter"],
        ["del", "inMeteringPoint"],
        ["del", "outMeteringPoint"],
    ]).exec((err, replies) => {
        callback(true)
    })
}

Auth.prototype.getToken = function(callback) {
    let that = this
    that.loggedIn((token) => {
        if (token) {
            callback(token)
        } else {
            getTokenWithRefreshToken(function(token) {
                callback(token)
            })
        }
    })
}

Auth.prototype.loggedIn = function(callback) {
    redis.get('token', function(err, token) {
        if (err) {
            console.error(err)
        } else {
            if (token) {
                let _token = JSON.parse(token)
                if (new Date().getTime() < (_token.created_at + _token.expires_in) * 1000) {
                    callback(token)
                } else {
                    callback(false)
                }
            } else {
                callback(false)
            }
        }
    })
}


module.exports = Auth
