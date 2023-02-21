const redisConnection = require("./redisConnection")

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const LENGTH = 6

function generateID() {
    let res = ""

    while (res.length < LENGTH) {
        res += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
    }

    if (redisConnection.hmget(`lobby:${res}:data`)) { // Lobby already exists
        return generateID()
    } else { // Lobby doesn't exist :thumbsup:
        return res.toUpperCase()
    }
}

module.exports = generateID