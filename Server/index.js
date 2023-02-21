const config = require("./config.json")
const express = require('express')
const app = express()

// Nginx?
app.set("trust proxy", 1);

// Middleware
app.use(require("./middleware/cors"))
app.use(require("./middleware/session"))

// Routes
app.use("/api/lobby", require("./routes/lobby"))

// Listen to port
app.listen(config.PORT, () => {
    console.log(`Example app listening on port ${config.PORT}`)
})