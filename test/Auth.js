const Auth = require('../libs/Auth');
const chai = require('chai');
const nock = require('nock');
const sinon = require('sinon');
const moment = require('moment');
var expect = chai.expect;


describe('Auth', function () {
  var auth, clock, accessToken, refreshToken, userId, email, username, password;

  before(function () {
    var date = new Date(2016, 8, 15)
    clock = sinon.useFakeTimers(date.getTime());
    auth = new Auth();
    accessToken = 'accessaccessaccessaccessaccessaccessaccessaccessaccess';
    refreshToken = 'refreshrefreshrefreshrefreshrefreshrefreshrefreshrefresh'
    userId = '3a0c03f5-8167-4b28-ab13-43563456345';
    email = 'ffaerber@gmail.com';
    username = 'ffaerber';
    password = '12345678';
  });


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

      var options = {
          username: username,
          password: password
      };
      auth.login(options, function(response){
        expect(response).to.equal(false);
        done();
      })
    })


  it('does login with correct username and password', function (done) {


    var fakeToken = { access_token: accessToken,
                      token_type: 'bearer',
                      expires_in: 7200,
                      refresh_token: refreshToken,
                      scope: 'full',
                      created_at: new Date().getTime()/1000 }

     fakeUser = { data:
                   { id: userId,
                     type: 'users',
                     links: { self: 'https://app.buzzn.net/api/v1/users/3a0c03f5-8167-4b28-ab13-9849dba87ffd' },
                     attributes:
                      { slug: 'ffaerber',
                        email: 'ffaerber@gmail.com',
                        'user-name': username,
                        'first-name': 'Felix',
                        'last-name': 'Faerber',
                        'about-me': 'sapere aude',
                        'md-img': 'https://d682lv2c2abix.cloudfront.net/uploads/profile/image/6bff403e-4e6f-49ef-819f-b4e2ca5e94b1/md_b2031d5872bfc9a4c984e07d798b3cf6.jpg' },
                     relationships:
                      { profile: [Object],
                        groups: [Object],
                        friends: [Object],
                        'metering-points': [Object],
                        devices: [Object] } } }

    nock('https://app.buzzn.net')
      .post('/oauth/token', {
        grant_type: 'password',
        username: email,
        password: password,
        scope: 'full',
      })
      .reply(200, fakeToken);

    nock('https://app.buzzn.net')
      .get('/api/v1/users/me')
      .reply(200, fakeUser);

    var options = {
        username: email,
        password: password
    };
    auth.login(options, function(status){
      expect(status).to.equal(true);
      done()
    })
  })


  it('does get the current active token', function (done) {
    auth.getToken(function(response) {
      expect(response.accessToken).to.equal(accessToken);
      expect(response.refreshToken).to.equal(refreshToken);
      done()
    })
  })


  it('does get the current active user', function (done) {
    auth.getToken(function(response) {
      expect(response.accessToken).to.equal(accessToken);
      expect(response.refreshToken).to.equal(refreshToken);
      done()
    })
  })



  it('does get a new token after two hours', function (done) {
    var date = new Date(2016, 8, 16, 2)
    clock = sinon.useFakeTimers(date.getTime());
    var newAccessToken = 'newaccessnewaccessnewaccessnewaccessnewaccessnewaccess'
    var newRefreshToken = 'newrefreshnewrefreshnewrefreshnewrefreshnewrefreshnewrefresh'
    var fakeResponse = {  access_token: newAccessToken,
                          token_type: 'bearer',
                          expires_in: 7200,
                          refresh_token: newRefreshToken,
                          scope: 'smartmeter',
                          created_at: new Date().getTime()/1000 }

    nock('https://app.buzzn.net')
      .post('/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
      .reply(200, fakeResponse);

    auth.getActiveToken(function(response){
      expect(response.accessToken).to.equal(newAccessToken);
      expect(response.refreshToken).to.equal(newRefreshToken);
      done();
    })
  })


  after(function () {
    auth.logout(function(){
      nock.cleanAll();
      clock.restore();
    })
  });

})
