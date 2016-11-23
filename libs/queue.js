"use strict"

const config = require('config');
const Kue = require('kue');
const queue = Kue.createQueue({
    redis: {
        host: config.get('redis.host')
    }
});

module.exports = queue
