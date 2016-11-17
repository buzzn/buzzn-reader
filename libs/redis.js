const Redis = require('redis')
const config = require('config')

const redis = Redis.createClient(6379, config.get('redis.host'))

module.exports = redis
