const express = require('express')
const app = express()
const port = 8080
const cors = require('cors')
const adjectiveNounGenerator = require("adjective-noun-generator")
const Redis = require('ioredis')
app.use(cors())

let redis = new Redis({
    port: 49153,
    host: "127.0.0.1",
    username: "default",
    password: "redispw"
})

redis.hmset("asd", {
    id: "jealous-ghost",
    host: "9120151201284",
    activePlayers: ["9120151201284"]
})
redis.expire("asd", 20)

// Create a new lobby
app.post('/api/createLobby', (req, res) => {
    let newLobby = {
        id: adjectiveNounGenerator.default({
            separator: "-"
        }).toLowerCase()
    }
    lobbies.push(newLobby)
    res.send({
        status: 200,
        lobby: newLobby.id
    })
})

// Fetch your currently created lobby, if it exists
app.get('/api/currentLobby', (req, res) => {

})

// Get all lobbies
app.get('/api/getLobbies', (req, res) => {
    res.send({
        status: 200,
        lobbies: lobbies
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})