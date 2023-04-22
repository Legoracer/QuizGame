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

        await redisConnection.hmset(`user:${username}`, {
            total_games: 0,
            wins: 0,
            total_answers: 0,
            correct_answers: 0
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
    let authData = await redisConnection.hgetall(`auth:${username}`)
    let userData = await redisConnection.hgetall(`user:${username}`)

    return {
        auth: authData,
        user: userData
    }
}

module.exports = {
    login: login,
    signup: signup,
    getUser: getUser
}