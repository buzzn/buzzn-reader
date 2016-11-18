const config = require('config');
const superagent = require('superagent')
const redis = require('./redis');

const request = {
    oauthToken: function(options) {
        return new Promise((resolve, reject) => {
            superagent
                .post(config.get('buzzn.host') + '/oauth/token')
                .send(options)
                .end(function(err, res) {
                    if (err || !res.ok) {
                        reject(err)
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
                .end(function(err, res) {
                    if (err || !res.ok) {
                        reject(err)
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
                        reject(err)
                    } else {
                        resolve(JSON.stringify(res.body.data))
                    }
                })
        })
    }
}

module.exports = request
