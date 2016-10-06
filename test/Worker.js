const Setup = require('../libs/Setup');
const Auth = require('../libs/Auth');
const Worker = require('../libs/Worker')
const chai = require('chai');
const nock = require('nock');
const sinon = require('sinon');
const expect = chai.expect;
const queue = require('kue').createQueue();
const _ = require('lodash')

describe('Worker', () => {
    let date = new Date(2016, 8, 12, 20)
    let auth, setup, clock, rawSML;

    before(() => {
        queue.testMode.enter(true);
        auth = new Auth();

        clock = sinon.useFakeTimers(date.getTime());
        email = 'ffaerber@gmail.com';
        username = 'ffaerber';
        password = 'xxxxxxxx';
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
    });

    after(() => {
        auth.logout(() => {
            nock.cleanAll();
            clock.restore();
            queue.testMode.exit();
        })
    });

    afterEach(() => {
        queue.testMode.clear();
    });




    it('does dont send Reading if meter is not loggedIn', (done) => {
        queue.createJob('sml', {
            sml: rawSML
        }).save()
        let job = _.last(queue.testMode.jobs);

        job.on('failed', (errorMessage) => {
            expect(errorMessage).to.equal('noAuth');
            done();
        });

        queue.process('sml', (job, done) => {
            new Worker(job, done)
        });
    });




    it('does dont send Reading if meter is not Setup', (done) => {
        nock('https://app.buzzn.net')
            .post('/oauth/token', {
                grant_type: 'password',
                username: email,
                password: password,
                scope: 'smartmeter'
            })
            .reply(200, {
                access_token: 'accessaccessaccessaccessaccessaccessaccessaccessaccess',
                token_type: 'bearer',
                expires_in: 7200,
                refresh_token: 'refreshrefreshrefreshrefreshrefreshrefreshrefreshrefresh',
                scope: 'smartmeter',
                created_at: new Date().getTime() / 1000
            });

        nock('https://app.buzzn.net')
            .get('/api/v1/users/me')
            .reply(200, {
                data: {
                    id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                    type: 'users',
                    links: {
                        self: 'https://app.buzzn.net/api/v1/users/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                    },
                }
            });

        nock('https://app.buzzn.net')
            .get('/api/v1/users/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/meters')
            .reply(200, {
                data: [{
                    id: 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz',
                    type: 'meters'
                }],
                meta: {
                    total_pages: 1
                }
            });


        auth.login({
            username: email,
            password: password
        }, (response) => {
            queue.createJob('sml', {
                sml: rawSML
            }).save()
            let job = _.last(queue.testMode.jobs);
            queue.process('sml', (job, done) => {
                new Worker(job, done)
            });

            job.on('failed', (errorMessage) => {
                expect(errorMessage).to.equal('noSetup');
                done();
            });
        })
    });




    it('does send Reading if meter is Setup', (done) => {
        nock('https://app.buzzn.net')
            .post('/oauth/token', {
                grant_type: 'password',
                username: email,
                password: password,
                scope: 'smartmeter'
            })
            .reply(200, {
                access_token: 'accessaccessaccessaccessaccessaccessaccessaccessaccess',
                token_type: 'bearer',
                expires_in: 7200,
                refresh_token: 'refreshrefreshrefreshrefreshrefreshrefreshrefreshrefresh',
                scope: 'smartmeter',
                created_at: new Date().getTime() / 1000
            });

        nock('https://app.buzzn.net')
            .get('/api/v1/users/me')
            .reply(200, {
                data: {
                    id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                    type: 'users',
                    links: {
                        self: 'https://app.buzzn.net/api/v1/users/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                    },
                }
            });

        let reading = {
            "data": {
                "id": "57f63232d75dd90b5b0048db",
                "type": "readings",
                "links": {
                    "self": "https://app.buzzn.net/api/v1/readings/57f63232d75dd90b5b0048db"
                },
                "attributes": {
                    "energy-a-milliwatt-hour": 640000,
                    "energy-b-milliwatt-hour": null,
                    "power-a-milliwatt": 2600,
                    "power-b-milliwatt": null,
                    "timestamp": "2016-09-12T20:00:00.000+02:00",
                    "meter-id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"
                }
            }
        }

        nock('https://app.buzzn.net')
            .post('/api/v1/readings', {
                timestamp: '2016-09-12T18:00:00.000Z',
                meter_id: "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz",
                energy_a_milliwatt_hour: 640000,
                energy_b_milliwatt_hour: null,
                power_a_milliwatt: 2600,
                power_b_milliwatt: null
            })
            .reply(200, reading);

        auth.login({
            username: email,
            password: 'braunkohle'
        }, (response) => {
            setup = new Setup(rawSML)
            setup.init((response) => {
                queue.createJob('sml', {
                    sml: rawSML
                }).save()
                let job = _.last(queue.testMode.jobs);
                queue.process('sml', (job, done) => {
                    new Worker(job, done)
                });
                job.on('failed', (errorMessage) => {
                    console.log(errorMessage);
                    done();
                });
                job.on('complete', (result) => {
                    expect(JSON.parse(result.text)).to.deep.equal(reading);
                    done();
                });

            })
        })




    });

});
