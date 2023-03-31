const config = require("../config.json")
let redisConnection = require("./redisConnection")
const bcrypt = require('bcrypt');
const sha256 = require("sha256")

async function signup(email, username, password) {
    let existingData = await redisConnection.hgetall(`auth:${username}`)

    if (Object.keys(existingData).length == 0) {
        let hash = sha256(password)

        await redisConnection.hmset(`auth:${username}`, {
            username: username,
            password: hash,
            email: email
        })

        return true
    }

    return false
}

async function login(username, password) {
    let existingData = await redisConnection.hgetall(`auth:${username}`)

    let hash = sha256(password)

    if (existingData && existingData.password == hash) {
        return true
    }

    return false
}

async function getUser(username) {
    let existingData = await redisConnection.hgetall(`auth:${username}`)
    return existingData
}

module.exports = {
    login: login,
    signup: signup,
    getUser: getUser
}