const Setup = require('../libs/Setup')
const Auth = require('../libs/Auth')
const Mock = require('./Mock')

const chai = require('chai')
var expect = chai.expect

let username = 'user@email.com'
let password = 'xxxxxxxx'

describe('Setup', () => {
    var auth, setup, mock, rawSML

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


    after(() => {
        auth.reset(() => {
            mock.cleanAll()
        })
    })


    it('does not init Setup with loggedIn false', (done) => {
        setup = new Setup(rawSML)
        setup.init((error, response) => {
            if (error) {
                expect(error.message).to.equal('noAuth')
                done()
            } else {
                console.log(response);
            }
        })
    })



    it('does init Setup with loggedIn true and created meter and inRegister', (done) => {
        mock.oauthTokenViaPassword()
        mock.usersMe()
        mock.userMetersEmpty()
        let mockResponse = mock.createMeter()
        mock.createRegister('in')

        auth.login({
            username: username,
            password: password
        }, (error, response) => {
            if (error) {
                console.error(error);
            } else {
                setup = new Setup(rawSML)
                setup.init((error, response) => {
                    if (error) {
                        console.error(error)
                    } else {
                        expect(JSON.parse(response)).to.deep.equal(mockResponse.data)
                        done()
                    }
                })
            }

        })
    })



    it('does not init Setup with loggedIn true and foreign existing meter', (done) => {
        mock.oauthTokenViaPassword()
        mock.usersMe()
        mock.userMetersEmpty()
        let mockResponse = mock.createExistingMeter()

        auth.login({
            username: username,
            password: password
        }, (error, response) => {
            if (error) {
                console.error(error)
            } else {
                setup = new Setup(rawSML)
                setup.init((error, response) => {
                    if (error) {
                        let firstError = mockResponse.errors[0] // really ugly
                        expect(error.message).to.deep.equal(firstError.detail)
                        done()
                    }
                })
            }
        })
    })


    it('does init Setup with loggedIn true and with existing meter', (done) => {
        mock.oauthTokenViaPassword()
        mock.usersMe()
        let mockResponse = mock.userMeters()
        mock.createReading()

        auth.login({
            username: username,
            password: password
        }, (response) => {
            setup = new Setup(rawSML)
            setup.init((error, response) => {
                if (error) {
                    console.error(error)
                } else {
                    expect(JSON.parse(response)).to.deep.equal(mockResponse.data[0])
                    done()
                }
            })
        })
    })



})
