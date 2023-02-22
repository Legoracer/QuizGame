const session = require('express-session')
const redisConnection = require("../modules/redisConnection")
let RedisStore = require('connect-redis')(session)

module.exports = session({
    store: new RedisStore({ client: redisConnection }),
    saveUninitialized: true,
    secret: "potatoes",
    resave: false
})