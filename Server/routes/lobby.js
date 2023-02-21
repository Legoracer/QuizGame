const express = require('express')
var router = express.Router()
const redisConnection = require("../modules/redisConnection")

router.get("/", function(req, res) {

})

router.get("/:id", function(req, res) {
    res.send("Works")
})

module.exports = router