const config = require("../config.json")
let redisConnection = require("./redisConnection")
const bcrypt = require('bcrypt');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

async function signup(email, username, password) {
    let existingData = await redisConnection.hgetall(`auth:${username}`)
    
    if (Object.keys(existingData).length != 0) return false; // exists

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
            
            redisConnection.hmset(`auth:${username}`, {
                username: username,
                password: hash,
                email: email
            })

        });
    });

    return true
}

async function login(username, password) {
    let existingData = await redisConnection.hgetall(`auth:${username}`)
    
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
            
            if (existingData && existingData.password == hash) {
                return true
            }

        });
    });

    return false
}

module.exports = {
    login: login,
    signup: signup
}