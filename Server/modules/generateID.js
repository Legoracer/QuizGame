const redisConnection = require("./redisConnection")

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const NUMBERS = "0123456789"
const LENGTH = 6

function generateID() {
    let res = ""

    while (res.length < LENGTH) {
        let x = res.length%2 == 0 ? CHARACTERS : NUMBERS;
        res += x.charAt(Math.floor(Math.random() * x.length));
    }

    return res.toUpperCase()
}

module.exports = generateID