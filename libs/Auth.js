const config = require('config');
const request = require('superagent')
const request2 = require('./request')
const redis = require('./redis')

function Auth() {}

Auth.prototype.login = function(options) {
    return new Promise((resolve, reject) => {
        getTokenWithPassword(options)
            .then(
                result => getUser(),
                reject
            )
            .then(resolve, reject)
    })
}


Auth.prototype.logout = function(callback) {
    let that = this

    that.getToken()
        .then(
            resolve => {
                let token = JSON.parse(resolve)
                request2.oauthRevoke(token)
                    .then(result => {
                        callback(null, result)
                    })
            },
            reject => {
                callback(error)
            }
        )

}


Auth.prototype.getToken = function() {
    return new Promise((resolve, reject) => {
        let that = this
        that.loggedIn()
            .then(
                resolve,
                reject => {
                    getTokenWithRefreshToken()
                        .then(
                            token => {
                                resolve(token)
                            }
                        )
                }
            )
    })
}


Auth.prototype.loggedIn = function() {
    return new Promise((resolve, reject) => {
        redis.getAsync('token')
            .then(
                record => {
                    let token = JSON.parse(record)
                    if (token) {
                        let expiresAt = (token.created_at + token.expires_in) * 1000
                        let beforeExpiresAt = expiresAt - (15 * 60 * 1000)
                        if (new Date().getTime() < beforeExpiresAt) {
                            resolve(token)
                        } else {
                            reject(new Error('token_expired'))
                        }
                    } else {
                        reject(new Error('noAuth'))
                    }

                }
            )
            .then(resolve)
    })
}

function getTokenWithPassword(options) {
    return new Promise((resolve, reject) => {
        request
            .post(config.get('buzzn.host') + '/oauth/token')
            .send({
                grant_type: 'password',
                username: options.username,
                password: options.password,
                scope: 'smartmeter'
            })
            .end((err, res) => {
                if (err || !res.ok) {
                    reject(res.body)
                } else {
                    let token = JSON.stringify(res.body)
                    redis.set("token", token, (err, reply) =>
                        resolve(token)
                    )
                }
            })
    })
}


function getTokenWithRefreshToken() {
    return new Promise((resolve, reject) => {
        redis.getAsync('token')
            .then(record => {
                let token = JSON.parse(record)
                return request2.oauthToken({
                    grant_type: "refresh_token",
                    refresh_token: token.refresh_token
                })
            })
            .then(resolve)
    })
}

function getUser() {
    return new Promise((resolve, reject) => {
        redis.getAsync('token')
            .then(res => {
                return request2.usersMe(JSON.parse(res))
            })
            .then(res => {
                redis.setAsync("user", res)
                return res
            })
            .then(resolve)
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
        ["del", "inRegister"],
        ["del", "outRegister"],
    ]).exec((error, replies) => {
        if (error) {
            callback(error)
        } else {
            callback(null, replies)
        }
    })
}




function getUser() {
    return new Promise((resolve, reject) => {
        redis.getAsync('token')
            .then(res => {
                return request2.usersMe(JSON.parse(res))
            })
            .then(res => {
                redis.setAsync("user", res)
                return res
            })
            .then(resolve)
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
        ["del", "inRegister"],
        ["del", "outRegister"],
    ]).exec((error, replies) => {
        if (error) {
            callback(error)
        } else {
            callback(null, replies)
        }
    })
}




module.exports = Auth
