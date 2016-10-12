const Setup = require('../libs/Setup')
const Auth = require('../libs/Auth')
const Worker = require('../libs/Worker')
const Mock = require('./Mock')

const chai = require('chai')
const expect = chai.expect
const queue = require('kue').createQueue()
const _ = require('lodash')

let username = 'user@email.com'
let password = 'xxxxxxxx'

describe('Worker', () => {
    let auth, setup, mock, rawSML

    before(() => {
        queue.testMode.enter(true)
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

        auth = new Auth()
        setup = new Setup(rawSML)
        mock = new Mock()
    })

    after(() => {
        auth.logout(() => {
            mock.cleanAll()
            queue.testMode.exit()
        })
    })

    afterEach(() => {
        queue.testMode.clear()
    })


    it('does dont send Reading if meter is not loggedIn', (done) => {
        queue.createJob('sml', {
            sml: rawSML
        }).save()
        let job = _.last(queue.testMode.jobs)

        job.on('failed', (errorMessage) => {
            expect(errorMessage).to.equal('noAuth')
            done()
        })

        queue.process('sml', (job, done) => {
            new Worker(job, done)
        })
    })


    it('does dont send Reading if meter is not Setup', (done) => {
        mock.oauthTokenViaPassword()
        mock.usersMe()

        auth.login({
            username: username,
            password: password
        }, (response) => {
            queue.createJob('sml', {
                sml: rawSML
            }).save()
            let job = _.last(queue.testMode.jobs)
            queue.process('sml', (job, done) => {
                new Worker(job, done)
            })

            job.on('failed', (errorMessage) => {
                expect(errorMessage).to.equal('noSetup')
                done()
            })
        })
    })

    it('does send Reading if meter is loggedIn and Setup', (done) => {
        mock.oauthTokenViaPassword()
        mock.usersMe()
        mock.userMetersEmpty()
        mock.createMeter()
        mock.createMeteringPoint('in')
        let mockResponse = mock.createReading()

        auth.login({
            username: username,
            password: password
        }, (response) => {

            setup.init((meter) => {
                queue.createJob('sml', {
                    sml: rawSML
                }).save()
                let job = _.last(queue.testMode.jobs)
                queue.process('sml', (job, done) =>
                    new Worker(job, done)
                )

                job.on('complete', (response) => {
                    expect(JSON.parse(response.text)).to.deep.equal(mockResponse)
                    done()
                })

            })


        })
    })

})
