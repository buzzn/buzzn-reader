const setup = require('../libs/setup')
const redis = require('../libs/redis')
const Auth = require('../libs/Auth')
const Mock = require('./Mock')

const chai = require('chai')
var expect = chai.expect

let username = 'user@email.com'
let password = 'xxxxxxxx'

describe('Setup', () => {
    var auth, mock, rawSML

    before(() => {
        auth = new Auth()
        mock = new Mock()

        rawSML =
            "\n\
    /ESY5Q3DA1004 V3.04\n\
    \
    1-0:0.0.0*255(60327685)\n\
    1-0:1.8.0*255(00000000.6400000*kWh)\n\
    1-0:21.7.0*255(000000.10*W)\n\
    1-0:41.7.0*255(000002.00*W)\n\
    1-0:61.7.0*255(000000.50*W)\n\
    1-0:1.7.0*255(000002.60*W)\n\
    1-0:96.5.5*255(60)\n\
    0-0:96.1.255*255(1ESY1160327685)\n\
    !"
    })


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



    describe('without login', () => {
        it('does not init Setup', done => {
            setup.init(rawSML)
                .then(
                    resolved => {},
                    rejected => {
                        expect(rejected.message).to.equal('noAuth')
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


    describe('with login', () => {

        it('does not init Setup with foreign existing meter', done => {
            let oauthTokenViaPassword = mock.oauthTokenViaPassword()
            let usersMe = mock.usersMe()
            let userMetersEmpty = mock.userMetersEmpty()
            let createExistingMeter = mock.createExistingMeter()

            auth.login({
                    username: username,
                    password: password
                })
                .then(
                    resolve => setup.init(rawSML)
                )
                .then(
                    resolved => {},
                    rejected => {
                        let firstError = createExistingMeter.errors[0] // really ugly
                        expect(rejected.message).to.deep.equal(firstError.detail)
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

        it('does init Setup and created meter and register', done => {
            let oauthTokenViaPassword = mock.oauthTokenViaPassword()
            let usersMe = mock.usersMe()
            let userMetersEmpty = mock.userMetersEmpty()
            let createMeter = mock.createMeter()
            let createRegister = mock.createRegister('in')

            auth.login({
                    username: username,
                    password: password
                })
                .then(
                    resolve => setup.init(rawSML)
                )
                .then(
                    resolved => {
                        expect(JSON.parse(resolved)).to.deep.equal(createMeter.data)
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
                            JSON.stringify(createMeter.data),
                            null, null
                        ])
                        done()
                    }
                )
        })


        it('does init Setup with existing meter', (done) => {
            mock.oauthTokenViaPassword()
            mock.usersMe()
            let mockResponse = mock.userMeters()
            mock.createReading()

            auth.login({
                    username: username,
                    password: password
                })
                .then(
                    resolve => setup.init(rawSML)
                )
                .then(
                    resolved => {
                        expect(resolved).to.deep.equal(mockResponse.data[0])
                        done()
                    }
                )
        })

    })







})
