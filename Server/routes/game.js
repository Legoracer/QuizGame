const express = require('express')
let router = express.Router()
const rateLimit = require('express-rate-limit')
const redisConnection = require("../modules/redisConnection")
const generateID = require("../modules/generateID")

const rateLimiter = rateLimit({
    windowMs: 1 * 60, // One minute
    max: 2,
    standardHeaders: true,
    legacyHeaders: false
})


// TODO: Set TTL
// TODO: Create lobby handlers too

// Creating a new lobby
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

// Joining an existing lobby
router.put("/join/:id", async function(req, res) {
    const id = req.params.id

    let state = await redisConnection.get(`game:${id}:state`)
    if (state == "0:0") {
        res.send(200)
    } else {
        res.send(404)
    }
})

// List of lobbies
router.get("/", async function(req, res) {
    let lobbies = await redisConnection.keys("game:*:data")
    lobbies = await Promise.all(
        lobbies.map(async (v) => v.split(":")[1])
    )
    res.send(lobbies)
})

// Lobby information
router.get("/:id", async function(req, res) {
    let state = await redisConnection.get(`game:${req.params.id}:state`)
    let game = await redisConnection.hgetall(`game:${req.params.id}:data`)
    let points = await redisConnection.zrange(`game:${req.params.id}:points`, 0, 99, "WITHSCORES")
    let pointsMap = {}

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