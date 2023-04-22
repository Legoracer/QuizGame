const config = require("../config.json")
let Redis = require("ioredis")

let redisConnection = new Redis({
    port: config.redis.port,
    host: config.redis.host,
    username: config.redis.username,
    password: config.redis.password
})

module.exports = redisConnection
