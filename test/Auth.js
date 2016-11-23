const config = require('config')
const Auth = require('../libs/Auth')
const Mock = require('./Mock')

const chai = require('chai')
var expect = chai.expect

const redis = require('../libs/redis')

let username = 'user@email.com'
let password = 'xxxxxxxx'

let auth = new Auth()
let mock = new Mock()

describe('Auth', () => {

    afterEach(done => {
        auth.reset()
            .then(
                resolve => {
                    //mock.cleanAll()
                    done()
                },
                rejected => {}
            )
    })



    it('does not login with incorrect username and password', (done) => {
        let oauthTokenViaPasswordInvalidGrant = mock.oauthTokenViaPasswordInvalidGrant()

        auth.login({
                username: username,
                password: password
            })
            .then(
                resolve => {},
                rejected => {
                    expect(rejected).to.deep.equal(oauthTokenViaPasswordInvalidGrant)
                    return redis.multi().mget('token', 'user', 'meter', 'inRegister', 'outRegister').execAsync()
                }
            )
            .then(
                records => [].concat.apply([], records)
            )
            .then(
                records => {
                    expect(records).to.deep.equal([null, null, null, null, null])
                    done()
                }
            )
    })


    it('does login with correct username and password', done => {
        let oauthTokenViaPassword = mock.oauthTokenViaPassword()
        let usersMe = mock.usersMe()

        auth.login({
                username: username,
                password: password
            })
            .then(
                resolve => {
                    expect(JSON.parse(resolve)).to.deep.equal(usersMe.data)
                    return redis.multi().mget('token', 'user', 'meter', 'inRegister', 'outRegister').execAsync()
                }
            )
            .then(
                records => [].concat.apply([], records)
            )
            .then(
                records => {
                    expect(records).to.deep.equal([
                        JSON.stringify(oauthTokenViaPassword),
                        JSON.stringify(usersMe.data),
                        null, null, null
                    ])
                    done()
                }
            )


    })

    it('getToken', (done) => {
        let oauthTokenViaPassword = mock.oauthTokenViaPassword()
        let usersMe = mock.usersMe()

        auth.login({
                username: username,
                password: password
            })
            .then(
                resolve => auth.getToken()
            )
            .then(
                token => {
                    expect(token).to.deep.equal(oauthTokenViaPassword)
                    done()
                }
            )
    })




    it('does get a new token after two hours', (done) => {
        let oauthTokenViaPassword = mock.oauthTokenViaPassword()
        let usersMe = mock.usersMe()
        let oauthTokenViaRefreshToken = mock.oauthTokenViaRefreshToken()

        auth.login({
                username: username,
                password: password
            })
            .then(
                resolve => auth.getToken()
            )
            .then(
                token => {
                    expect(token).to.deep.equal(oauthTokenViaPassword)
                    mock = new Mock({
                        date: new Date(2016, 8, 20, 4)
                    })
                    return auth.getToken()
                }
            )
            .then(
                newToken => {
                    expect(JSON.parse(newToken)).to.deep.equal(oauthTokenViaRefreshToken)
                    done()
                }
            )
    })


    it('does logout', (done) => {
        let oauthTokenViaPassword = mock.oauthTokenViaPassword()
        let usersMe = mock.usersMe()
        let oauthRevoke = mock.oauthRevoke()

        auth.login({
                username: username,
                password: password
            })
            .then(
                resolve => {
                    expect(JSON.parse(resolve)).to.deep.equal(usersMe.data)
                    return redis.multi().mget('token', 'user', 'meter', 'inRegister', 'outRegister').execAsync()
                }
            )
            .then(
                records => [].concat.apply([], records)
            )
            .then(
                records => {
                    expect(records).to.deep.equal([
                        JSON.stringify(oauthTokenViaPassword),
                        JSON.stringify(usersMe.data),
                        null, null, null
                    ])
                    return auth.logout()
                }
            )
            .then(
                resolved => {
                    return redis.multi().mget('token', 'user', 'meter', 'inRegister', 'outRegister').execAsync()
                }
            )
            .then(
                records => [].concat.apply([], records)
            )
            .then(
                records => {
                    expect(records).to.deep.equal([null, null, null, null, null])
                    done()
                }
            )
    })




})
