const express = require('express')
const auth = require("../modules/auth")
let router = express.Router()
const redisConnection = require("../modules/redisConnection")

// Creating a new lobby
router.post("/signup", async function(req, res) {
    console.log(req.body)
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    let success = await auth.signup(email, username, password)
    if (success) {
        req.session.username = username
        res.status(200)
    } else {
        res.status(401)
    }
    
})

// Joining an existing lobby
router.post("/login", async function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    let success = await auth.login(username, password)
    if (success) {
        req.session.username = username
        res.sendStatus(200)
    }
    res.sendStatus(401)
})

router.post("/logout", async function(req, res) {
    req.session.username = null
})

router.get("/", async function(req, res) {
    let data = await auth.getUser(req.session.username)
    let newData = {
        username: data.username,
        email: data.email
    }
    console.log(newData)
    res.send(newData)
})

module.exports = router