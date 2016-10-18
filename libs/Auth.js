const Redis = require('redis')
const config = require('config')
const request = require('superagent')

let host = 'https://app.buzzn.net'
let redis = Redis.createClient(6379, config.get('redis.host'))

function Auth(host) {}

Auth.prototype.login = function(options, callback) {
    getTokenWithPassword(options, (error, token) => {
        if (error) {
            callback(error)
        } else {
            getUser((error, user) => {
                if (error) {
                    callback(error)
                } else {
                    callback(null, user)
                }
            })
        }
    })
}

Auth.prototype.logout = function(callback) {
    let that = this
    that.getToken((error, token) => {
        if (error) {
            callback(error)
        } else {
            request
                .post(host + '/oauth/revoke')
                .set('Authorization', 'Bearer ' + token.access_token)
                .send({
                    token: token.access_token,
                })
                .end(function(err, res) {
                    if (err || !res.ok) {
                        callback(new Error(err))
                    } else {
                        that.reset((error, status) => {
                            if (error) {
                                callback(new Error(err))
                            } else {
                                callback(null, res.body)
                            }
                        })
                    }
                })
        }
    })
}





Auth.prototype.getToken = function(callback) {
    let that = this
    that.loggedIn((error, token) => {
        if (error) {
            getTokenWithRefreshToken((error, token) => {
                if (error) {
                    callback(error)
                } else {
                    callback(null, token)
                }
            })
        } else {
            callback(null, token)
        }
    })
}


Auth.prototype.loggedIn = function(callback) {
    redis.get('token', (error, record) => {
        if (error) {
            callback(error)
        } else {
            let token = JSON.parse(record)
            if (token) {
                if (new Date().getTime() < (token.created_at + token.expires_in) * 1000) {
                    callback(null, token)
                } else {
                    callback(new Error('token_expired'))
                }
            } else {
                callback(new Error('noAuth'))
            }
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
                callback(res.body)
            } else {
                let token = JSON.stringify(res.body)
                redis.set("token", token, (err, reply) =>
                    callback(null, token)
                )
            }
        })
}

function getTokenWithRefreshToken(callback) {
    redis.get('token', (error, token) => {
        if (error) {
            console.error(err)
            callback(new Error(error))
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
                        callback(new Error(err))
                    } else {
                        let token = JSON.stringify(res.body)
                        redis.set("token", token, function(err, reply) {
                            if (err) {
                                console.error(err)
                                callback(new Error(err))
                            } else {
                                callback(null, token)
                            }
                        })
                    }
                })
        }
    })
}

function getUser(callback) {
    redis.get('token', (error, record) => {
        if (error) {
            callback(error)
        } else {
            let token = JSON.parse(record)
            if (token) {
                request
                    .get(host + '/api/v1/users/me')
                    .set('Authorization', 'Bearer ' + token.access_token)
                    .end((err, res) => {
                        if (err || !res.ok) {
                            console.error(err)
                            callback(new Error(err))
                        } else {
                            let user = JSON.stringify(res.body.data)
                            redis.set("user", user, (err, reply) => {
                                callback(null, user)
                            })
                        }
                    })
            } else {
                callback(false)
            }
        }
    })
}

Auth.prototype.reset = function(callback) {
    var that = this
    var _redis = redis,
        multi
    _redis.multi([
        ["del", "token"],
        ["del", "user"],
        ["del", "meter"],
        ["del", "inMeteringPoint"],
        ["del", "outMeteringPoint"],
    ]).exec((error, replies) => {
        if (error) {
            callback(error)
        } else {
            callback(null, replies)
        }
    })
}




module.exports = Auth
