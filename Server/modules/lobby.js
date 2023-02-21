const redisConnection = require("./redisConnection")

function lobby(id, host) {
    // Check if exists
    let data = redisConnection.hmget(`lobby:${id}:`)
}

module.exports = lobby