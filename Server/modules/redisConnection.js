const Redis = require('iosredis')

let redisConnection = new Redis({
    port: 49153,
    host: "127.0.0.1",
    username: "default",
    password: "redispw"
})

export default redisConnection