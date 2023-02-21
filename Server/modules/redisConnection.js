const config = require("../config.json")
var Redis = require('iosredis')

let redisConnection = new Redis({
    port: config.redis.port,
    host: config.redis.host,
    username: config.redis.username,
    password: config.redis.password
})

export default redisConnection