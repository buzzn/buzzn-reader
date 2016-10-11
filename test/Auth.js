const config = require('config')
const Auth = require('../libs/Auth')
const Mock = require('./Mock')

const chai = require('chai')
var expect = chai.expect

const Redis = require('redis')
let redis = Redis.createClient(6379, config.get('redis.host'))

describe('Auth', () => {
    var auth, mock

    before(() => {
        mock = new Mock()
        auth = new Auth()
    })

    after(() => {
        auth.logout(() => {
            mock.cleanAll()
        })
    })

    it('does not login with incorrect username and password', (done) => {
        let mockResponse = mock.oauthTokenViaPasswordInvalidGrant()

        auth.login({
            username: 'ffaerber@gmail.com',
            password: 'xxxxxxxx'
        }, (response) => {
            // TODO remove null and use mockResponse
            expect(response).to.equal(null)
            done()
        })
    })


    it('does login with correct username and password', (done) => {
        mock.oauthTokenViaPassword()
        let mockResponse = mock.usersMe()

        auth.login({
            username: 'ffaerber@gmail.com',
            password: 'xxxxxxxx'
        }, (status) => {
            expect(JSON.parse(status)).to.deep.equal(mockResponse)
            done()
        })
    })


    it('does get a new token after two hours', (done) => {
        mock = new Mock({
            date: new Date(2016, 8, 20, 2)
        })
        let mockResponse = mock.oauthTokenViaRefreshToken()

        auth.getToken((response) => {
            expect(JSON.parse(response)).to.deep.equal(mockResponse)
            done()
        })
    })




})
