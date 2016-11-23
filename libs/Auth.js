const config = require('config');
const request = require('./request')
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


Auth.prototype.logout = function() {
    return new Promise((resolve, reject) => {
        let that = this
        that.getToken()
            .then(
                token => request.oauthRevoke(token),
                reject
            )
            .then(
                resolved => that.reset(),
                reject
            )
            .then(resolve, reject)
    })
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
                            token => resolve(token)
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
                        if (new Date().getTime() < expiresAt) {
                            resolve(token)
                        } else {
                            reject(token)
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

        return request.oauthToken({
                grant_type: 'password',
                username: options.username,
                password: options.password,
                scope: 'smartmeter'
            })
            .then(
                token => {
                    redis.set("token", token, (err, reply) =>
                        resolve(token)
                    )
                },
                reject
            )

    })
}


function getTokenWithRefreshToken() {
    return new Promise((resolve, reject) => {
        redis.getAsync('token')
            .then(
                record => {
                    let token = JSON.parse(record)
                    return request.oauthToken({
                        grant_type: "refresh_token",
                        refresh_token: token.refresh_token
                    })
                }
            )
            .then(resolve)
    })
}

function getUser() {
    return new Promise((resolve, reject) => {
        redis.getAsync('token')
            .then(res => {
                return request.usersMe(JSON.parse(res))
            })
            .then(res => {
                redis.setAsync("user", res)
                return res
            })
            .then(resolve)
    })
}



Auth.prototype.reset = function() {
    return new Promise((resolve, reject) => {
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
                reject(error)
            } else {
                resolve(replies)
            }
        })
    })
}




module.exports = Auth
