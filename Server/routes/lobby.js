const express = require('express')
var router = express.Router()
const rateLimit = require('express-rate-limit')
const redisConnection = require("../modules/redisConnection")
const generateID = require("../modules/generateID")

const rateLimiter = rateLimit({
    windowMs: 1 * 60, // One minute
    max: 2,
    standardHeaders: true,
    legacyHeaders: false
})

router.post("/create", rateLimiter, async function(req, res) {
    let genId = generateID()
    let hostId = req.sessionID

    let statePromise = redisConnection.set(`game:${genId}:state`, "0:0")
    let dataPromise = redisConnection.hmset(`game:${genId}:data`, {
        id: genId,
        host: hostId
    })
    let pointsPromise = redisConnection.zadd(`game:${genId}:points`, [])

    await Promise.all([statePromise, dataPromise, pointsPromise])
    
    res.status(200)
})

router.put("/join/:id", async function(req, res) {
    const id = req.params.id

    let state = await redisConnection.get(`game:${id}:state`)
    if (state == "0:0") {
        res.send(200)
    } else {
        res.send(404)
    }
})

router.get("/", async function(req, res) {
    var lobbies = await redisConnection.keys("game:*:data")
    lobbies = await Promise.all(
        lobbies.map(async (v) => v.split(":")[1])
    )
    res.send(lobbies)
})

router.get("/:id", async function(req, res) {
    var state = await redisConnection.get(`game:${req.params.id}:state`, 'ttl', )
    var game = await redisConnection.hgetall(`game:${req.params.id}:data`)
    var points = await redisConnection.zrange(`game:${req.params.id}:points`, 0, 99, "WITHSCORES")
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
        data: game,
        points: pointsMap
    })
})

module.exports = router