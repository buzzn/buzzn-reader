const config = require('config')
const bluebird = require('bluebird')
const Redis = require('redis')

bluebird.promisifyAll(Redis.RedisClient.prototype)
bluebird.promisifyAll(Redis.Multi.prototype)
const redis = Redis.createClient(6379, config.get('redis.host'))

module.exports = redis
