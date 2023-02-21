const express = require('express')
const app = express()
const port = 8080
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

let lobbies = []

// Nginx?
app.set("trust proxy", 1);

// Middleware
app.use(require("./middleware/cors"))
app.use(require("./middleware/session"))

// Routes
app.use("/api/lobby", require("./routes/lobby"))

// Listen to port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})