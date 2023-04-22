const express = require('express')
let router = express.Router()
const gameManager = require("../modules/gameManager")

router.ws("/:id", async function(ws, req) {
    let id = req.params.id;
    let game = gameManager.get(id)


    console.log(`${req.session.username} connected to ${id}`)

    if (game) {
        game.onClientJoined(ws, req)
        
        // game.sendAll(JSON.stringify({
        //     type: "message",
        //     from: "system",
        //     content: `${req.session.username} has joined!`
        // }))
    
        game.sendOne(req.sessionID, JSON.stringify({
            type: "messageHistory",
            messages: game.messages
        }))

        ws.on("close", function() {
            // game.sendAll(JSON.stringify({
            //     type: "message",
            //     from: "system",
            //     content: `${req.session.username} has left!`
            // }))
        
            game.onClientLeft(ws, req)
        })

        ws.on("message", function(msg) {
            let data = JSON.parse(msg)
            
            if (data.type == "getPlayerList") {
                game.sendPlayerList(req.sessionID)
            } else if (data.type == "message") {
                game.addMessage(req.session.username, data.content)
            } else if (data.type == "start") {
                game.start(req.sessionID)
            } else if (data.type == "answer") {
                game.setAnswer(req.sessionID, data.answer, data.id)
            }
            // game.onMessage(ws, req, msg)
        })
    } else {
        // ws.close(400)
    }
})

module.exports = router