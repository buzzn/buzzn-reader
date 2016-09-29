const Auth = require('../libs/Auth');
const chai = require('chai');
const nock = require('nock');
const sinon = require('sinon');
const Redis = require('redis');
const config = require('config');
var expect = chai.expect;

let host  = 'https://app.buzzn.net';
let redis = Redis.createClient(6379, config.get('redis.host'));


describe('Auth', function () {
  var auth, clock, accessToken, refreshToken, userId, email, username, password;

  before(function () {
    var date = new Date(2016, 8, 15)
    clock = sinon.useFakeTimers(date.getTime());
    auth = new Auth();
    accessToken = 'accessaccessaccessaccessaccessaccessaccessaccessaccess';
    refreshToken = 'refreshrefreshrefreshrefreshrefreshrefreshrefreshrefresh'
    userId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx';
    email = 'ffaerber@gmail.com';
    username = 'ffaerber';
    password = 'xxxxxxxx';
  });


  it('does not login with incorrect username and password', function (done) {
    nock('https://app.buzzn.net')
      .post('/oauth/token', {
        grant_type: 'password',
        username: username,
        password: password,
        scope: 'smartmeter',
      })
      .reply(401, {
        error: "invalid_grant",
        error_description: "The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client."
      });

    var options = {
      username: username,
      password: password
    };
    auth.login({ username: username, password: password }, function(response){
      expect(response).to.equal(false);
      done();
    })
  })


  it('does login with correct username and password', function (done) {
    nock('https://app.buzzn.net')
      .post('/oauth/token', {
        grant_type: 'password',
        username: email,
        password: password,
        scope: 'smartmeter',
      })
      .reply(200, {
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: 7200,
        refresh_token: refreshToken,
        scope: 'smartmeter',
        created_at: new Date().getTime()/1000
      });

    nock('https://app.buzzn.net')
      .get('/api/v1/users/me')
      .reply(200, {
        data: {
          id: userId,
          type: 'users',
          links: { self: 'https://app.buzzn.net/api/v1/users/3a0c03f5-8167-4b28-ab13-9849dba87ffd' }
        }
      });

    auth.login({ username: email, password: password }, function(status){
      redis.get('user', function (err, record) {
        expect(status).to.equal(record);
        done()
      })
    })
  })


  it('does get the current active token', function (done) {
    redis.get('token', function (err, record) {
      if(err){
        console.error(err);
      }else{
        let token = JSON.parse(record)
        expect(token.access_token).to.equal(accessToken);
        expect(token.refresh_token).to.equal(refreshToken);
        expect(token.created_at).to.equal( new Date().getTime()/1000 );
        done()
      }
    })
  })


  it('does get the current active user', function (done) {
    redis.get('user', function (err, record) {
      if(err){
        console.error(err);
      }else{
        let user = JSON.parse(record)
        expect(user.data.id).to.equal(userId);
        done()
      }
    })
  })



  it('does get a new token after two hours', function (done) {
    var date = new Date(2016,8,16,2)
    clock = sinon.useFakeTimers(date.getTime());
    var newAccessToken = 'newaccessnewaccessnewaccessnewaccessnewaccessnewaccess'
    var newRefreshToken = 'newrefreshnewrefreshnewrefreshnewrefreshnewrefreshnewrefresh'

    nock('https://app.buzzn.net')
      .post('/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
      .reply(200, {
        access_token: newAccessToken,
        token_type: 'bearer',
        expires_in: 7200,
        refresh_token: newRefreshToken,
        scope: 'smartmeter',
        created_at: new Date().getTime()/1000
      });

      auth.getToken(function(response){
        redis.get('token', function (err, record) {
          if (err){
            console.error(err);
          }else{
            let token = JSON.parse(record)
            expect(token.access_token).to.equal(newAccessToken);
            expect(token.refresh_token).to.equal(newRefreshToken);
            done();
          }
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
