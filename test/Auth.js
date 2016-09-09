const Auth = require('../libs/Auth');
const chai = require('chai');
const nock = require('nock');
const sinon = require('sinon');
const moment = require('moment');
var expect = chai.expect;



describe('login', function () {
  var clock, accessToken, refreshToken;

  before(function () {
    var date = new Date(2016, 8, 15)
    clock = sinon.useFakeTimers(date.getTime());
    accessToken = 'accessaccessaccessaccessaccessaccessaccessaccessaccess';
    refreshToken = 'refreshrefreshrefreshrefreshrefreshrefreshrefreshrefresh'
  });


  it('does login with correct username and password', function (done) {
    var username = 'ffaerber@gmail.com';
    var password = '12345678';
    var fakeResponse = {  access_token: accessToken,
                          token_type: 'bearer',
                          expires_in: 7200,
                          refresh_token: refreshToken,
                          scope: 'smartmeter',
                          created_at: new Date().getTime()/1000 }

    nock('https://app.buzzn.net')
      .post('/oauth/token', {
        grant_type: 'password',
        username: username,
        password: password,
        scope: 'smartmeter',
      })
      .reply(200, fakeResponse);

    let auth = new Auth();
    var options = {
        username: username,
        password: password
    };
    auth.login(options, function(response){
      expect(response).to.deep.equal(fakeResponse);
      done();
    })
  })



  it('does not login with incorrect username and password', function (done) {
    var date = new Date();
    var username = 'ffaerber@gmail.com';
    var password = 'xxxxxxxx';
    var fakeResponse = {  error: "invalid_grant",
                          error_description: "The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client."
                        }

    nock('https://app.buzzn.net')
      .post('/oauth/token', {
        grant_type: 'password',
        username: username,
        password: password,
        scope: 'smartmeter',
      })
      .reply(401, fakeResponse);

    let auth = new Auth();
    var options = {
        username: username,
        password: password
    };
    auth.login(options, function(response){
      expect(response).to.deep.equal(fakeResponse);
      done();
    })
  })




  it('does get the current active token', function (done) {
    let auth = new Auth();
    auth.getToken(function(response) {
      expect(response.accessToken).to.equal(accessToken);
      expect(response.refreshToken).to.equal(refreshToken);
      done()
    })
  })



  it('does get a new token after two hours', function (done) {

    var date = new Date(2016, 8, 16, 2)
    clock = sinon.useFakeTimers(date.getTime());

    var fakeResponse = {  access_token: 'newaccessnewaccessnewaccessnewaccessnewaccessnewaccess',
                          token_type: 'bearer',
                          expires_in: 7200,
                          refresh_token: 'newrefreshnewrefreshnewrefreshnewrefreshnewrefreshnewrefresh',
                          scope: 'smartmeter',
                          created_at: new Date().getTime()/1000 }

    nock('https://app.buzzn.net')
      .post('/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
      .reply(200, fakeResponse);

    let auth = new Auth();
    auth.getToken(function(response){
      expect(response).to.deep.equal(fakeResponse);
      done();
    })
  })


  after(function () {
    clock.restore();
  });

})
