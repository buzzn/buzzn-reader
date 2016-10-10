const Setup = require('../libs/Setup')
const Auth = require('../libs/Auth')
const Mock = require('./Mock')

const chai = require('chai')
var expect = chai.expect


describe('Setup', () => {
    var auth, setup, mock, rawSML

    before(() => {
        auth = new Auth()
        mock = new Mock(new Date(2016, 8, 15))

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
        auth.logout(() => {
            mock.cleanAll()
        })
    })


    it('does not init Setup with loggedIn false', (done) => {
        setup = new Setup(rawSML)
        setup.init((response) => {
            expect(response).to.equal(null)
            done()
        })
    })


    it('does init Setup with loggedIn true and without meter', (done) => {
        mock.oauthTokenViaPassword()
        mock.usersMe()
        mock.userMetersEmpty()
        let mockResponse = mock.createMeter()
        mock.createReading()

        auth.login({
            username: 'ffaerber@gmail.com',
            password: 'xxxxxxxx'
        }, (response) => {
            setup = new Setup(rawSML)
            setup.init((response) => {
                expect(JSON.parse(response)).to.deep.equal(mockResponse.data)
                done()
            })
        })
    })


    it('does init Setup with loggedIn true and with meter', (done) => {
        mock.oauthTokenViaPassword()
        mock.usersMe()
        let mockResponse = mock.userMeters()
        mock.createReading()

        auth.login({
            username: 'ffaerber@gmail.com',
            password: 'xxxxxxxx'
        }, (response) => {
            setup = new Setup(rawSML)
            setup.init((response) => {
                expect(JSON.parse(response)).to.deep.equal(mockResponse.data[0])
                done()
            })
        })
    })



})
