const express = require('express')
const app = express()
const port = 8080
const cors = require('cors')
const adjectiveNounGenerator = require("adjective-noun-generator")
const Redis = require('ioredis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const Randomstring = require('randomstring')

let redisClient = new Redis({
    port: 49153,
    host: "127.0.0.1",
    username: "default",
    password: "redispw"
})

let lobbies = []

app.set("trust proxy", 1);

app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: true,
      secret: "potatoes",
      resave: false,
    })
  )

app.use(cors({
    credentials: true,
    origin: true
}))

function generateLobbyID() {
    let id = Randomstring.generate({
        length: 5,
        charset: "alphanumeric",
        capitalization: "uppercase"
    })

    if (lobbies.find(lobby => lobby.id == id)) {
        return generateLobbyID()
    }

    return id
}

// Create a new lobby
app.post('/api/createLobby', (req, res) => {
    console.log(`SID: ${req.sessionID}`)

    let newLobby = {
        id: generateLobbyID(),
        host: req.sessionID
    }
    lobbies.push(newLobby)

    res.send({
        lobby: newLobby.id
    })
})

// Fetch your currently created lobby, if it exists
app.get('/api/currentLobby', (req, res) => {

})

// Get lobby
app.get('/api/getLobby', (req, res) => {
    let id = req.headers.id;
    
    res.send({
        data: lobby
    })
})

// Get all lobbies
app.get('/api/lobby/:id', (req, res) => {
    let lobby = lobbies.find(lobby => {
        return lobby.id == req.params.id
    })

    res.send({
        lobby: lobby
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})