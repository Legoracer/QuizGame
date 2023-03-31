const express = require('express')
let router = express.Router()
const gameManager = require("../modules/gameManager")

router.ws("/:id", async function(ws, req) {
    let id = req.params.id;
    let game = gameManager.get(id)


    console.log(`${req.sessionID} connected to ${id}`)
    if (game) {
        game.onClientJoined(ws, req)
        
        ws.on("close", function() {
            game.onClientLeft(ws, req)
        })

        ws.on("message", function(msg) {
            console.log("MESSAGE:",message)
            game.onMessage(ws, req, msg)
        })
    } else {
        // ws.close(400)
    }
})

module.exports = router