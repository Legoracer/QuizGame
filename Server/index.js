const https = require("https")
const config = require("./config.json")
const express = require('express')
const app = express()
let expressWs = require("express-ws")

// Ws
let sessionParser = require("./middleware/session")
expressWs(app, null, {
    wsOptions: {
        verifyClient: function() {

        }
    }
})
 
// Nginx?
app.set("trust proxy", 1);

// Middleware
app.use(require('cookie-parser')())
app.use(require("./middleware/cors"))
app.use(require("./middleware/session"))

// Routes
app.use("/api/game", require("./routes/game"))
app.use("/api/ws", require("./routes/ws"))

// Listen to port
app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`)
})