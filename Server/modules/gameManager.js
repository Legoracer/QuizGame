// Game Manager
function GameManager() {
    this.lobbies = {}
}

GameManager.prototype.create = function(id, host) {
    let game = new Game(id, host)
    this.lobbies[id] = game
    return game
}

GameManager.prototype.get = function(id) {
    return this.lobbies[id]
}

// Game
function Game(id, host) {
    this.id = id
    this.host = host
    this.state = "lobby"
    this.sockets = {}
}

Game.prototype.start = function(ws, req, msg) {
    if (req.sessionID == this.host) {
        
    }
}

Game.prototype.sendOne = function(sessionID, message) {
    let socket = this.sockets[sessionID]

    if (socket) {
        socket.send(message)
    }
}

Game.prototype.sendAll = function(message) {
    for (let socket of this.sockets) {
        socket.send(message)
    }
}

Game.prototype.onMessage = function(ws, req, msg) {
    if (msg == "start") {
        this.start()
    }
}

Game.prototype.onClientJoined = function(ws, req) {
    this.sockets[req.sessionID] = ws
}

Game.prototype.onClientLeft = function(ws, req) {
    this.sockets[req.sessionID] = null
}

module.exports = new GameManager()