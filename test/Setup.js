const Setup = require('../libs/Setup');
const Auth = require('../libs/Auth');
const nock = require('nock');

const chai = require('chai');
var expect = chai.expect;


const sinon = require('sinon');

describe('Setup', function () {
  var auth, setup, clock, rawSML;

  before(function () {
    auth = new Auth();
    let date = new Date(2016, 8, 12, 20)
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



  it('does not init Setup with loggedIn false', function (done) {
    setup = new Setup(rawSML)
    setup.init(function(response){
      expect(response).to.equal(false);
      done();
    })
  })




  it('does init Setup with loggedIn true', function (done) {
    var email = 'ffaerber@gmail.com';
    var password = 'xxxxxxxx';

    nock('https://app.buzzn.net')
      .post('/oauth/token', {
        grant_type: 'password',
        username: email,
        password: password,
        scope: 'smartmeter'})
      .reply(200, { access_token: 'accessaccessaccessaccessaccessaccessaccessaccessaccess',
                    token_type: 'bearer',
                    expires_in: 7200,
                    refresh_token: 'refreshrefreshrefreshrefreshrefreshrefreshrefreshrefresh',
                    scope: 'smartmeter',
                    created_at: new Date().getTime()/1000
                  });

    nock('https://app.buzzn.net')
      .get('/api/v1/users/me')
      .reply(200, {
                    data: {
                      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                      type: 'users',
                      links: { self: 'https://app.buzzn.net/api/v1/users/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'},
                     }
                  });

    nock('https://app.buzzn.net')
      .get('/api/v1/users/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/meters')
      .reply(200, { data:
                    [{
                      id: 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz',
                      type: 'meters'
                    }],
                    meta: { total_pages: 1 }
                  });

    auth.login({username: email, password: password}, function(response){
      setup = new Setup(rawSML)
      setup.init(function(response){
        expect(JSON.parse(response)).to.deep.equal({
          id: 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz',
          type: 'meters'
        });
        done();
      })
    })
  })


  after(function () {
    auth.logout(function(){
      nock.cleanAll();
      clock.restore();
    })
  });

})
