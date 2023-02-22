const config = require("./config.json")
const express = require('express')
const app = express()
let expressWs = require("express-ws")

// Ws

// Nginx?
app.set("trust proxy", 1);

// Middleware
app.use(require('cookie-parser')())
app.use(require("./middleware/cors"))
app.use(require("./middleware/session"))

let sessionParser = require("./middleware/session")
let wsApp = expressWs(app, null, {
    wsOptions : {
        verifyClient : (info, done) => {
            info.req.res = {}; 
            sessionParser(info.req, info.req.res, () => {
                console.log(info.req.session.id)
                done(info.req.sessionID);
            });
        }
    }
}).app

// Routes
app.use("/api/game", require("./routes/game"))
app.use("/api/ws", require("./routes/ws"))

// Listen to port
app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`)
})