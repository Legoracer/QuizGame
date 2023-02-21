const session = require('express-session')
const redisConnection = require("../modules/redisConnection")
var RedisStore = require('connect-redis')(session)

export default session({
    store: new RedisStore({ client: redisConnection }),
    saveUninitialized: true,
    secret: "potatoes",
    resave: false
})