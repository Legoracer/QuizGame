const express = require('express')
var router = express.Router()
const rateLimit = require('express-rate-limit')
const redisConnection = require("../modules/redisConnection")
const generateID = require("../modules/generateID")

const rateLimiter = rateLimit({
    windowMs: 1 * 60, // One minute
    max: 1,
    standardHeaders: true,
    legacyHeaders: false
})

router.post("/", rateLimiter, async function(req, res) {
    const id = req.body.id
    
    if (id) { // You wish to join a lobby
        let state = await redisConnection.get(`lobby:${id}:state`)
        if (state == "0:0") {
            res.send(200)
        } else {
            res.send(404)
        }
    } else { // You wish to create a lobby
        let genId = generateID()
        let hostId = req.sessionID

        let statePromise = redisConnection.set(`lobby:${genId}:state`, "0:0")
        let dataPromise = redisConnection.hmset(`lobby:${genId}:data`, {
            id: genId,
            host: hostId
        })
        let pointsPromise = redisConnection.zadd(`lobby:${genId}:points`, [])

        await Promise.all([statePromise, dataPromise, pointsPromise])
        
        res.status(200)
    }
})

router.get("/", async function(req, res) {
    var lobbies = await redisConnection.keys("lobby:*:data")
    lobbies = await Promise.all(
        lobbies.map(async (v) => v.split(":")[1])
    )
    res.send(lobbies)
})

router.get("/:id", async function(req, res) {
    var state = await redisConnection.get(`lobby:${req.params.id}:state`)
    var lobby = await redisConnection.hgetall(`lobby:${req.params.id}:data`)
    var points = await redisConnection.zrange(`lobby:${req.params.id}:points`, 0, 99, "WITHSCORES")
    var pointsMap = {}

    // Map points to [user] = points
    points.forEach((v, i) => {
        if (i%2 == 0) {
            console.log(i, v)
            pointsMap[v] = points[i+1]
        }
    })
    
    res.send({
        state: state,
        data: lobby,
        points: pointsMap
    })
})

module.exports = router