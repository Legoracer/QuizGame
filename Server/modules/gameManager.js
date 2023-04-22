const EventEmitter = require("events")
const Questions = require("../modules/questions.json")
const uuid = require('uuid');
const redis = require("../modules/redisConnection")

// Game Manager
function GameManager() {
    this.lobbies = {}
}

GameManager.prototype.create = function (id, host) {
    let game = new Game(id, host)
    this.lobbies[id] = game

    // game.on("end", function() {
    //     this.lobbies[id] = null
    // })

    return game
}

GameManager.prototype.get = function (id) {
    return this.lobbies[id]
}

// Game
function Game(id, host) {
    this.id = id
    this.host = host
    this.state = "lobby"
    this.sockets = {}
    this.messages = []
    this.started = false

    this.currentQuestion = {
        answers: [],
        correctAnswer: -1,
        id: ""
    }

    this.playersAnswered = {}

    // this.event = new EventEmitter()
}

Game.prototype = EventEmitter; // This may cause issues

Game.prototype.start = function (sessionId) {
    if (sessionId == this.host && !this.started) {
        this.started = true
        this.ask()
    }
}

Game.prototype.ask = function() {
    let [category, question] = this.generateQuestion()
    let id = uuid.v4()

    this.currentQuestion = {
        answers: question.answers,
        correctAnswer: question.correctAnswer,
        id: id
    }
    this.sendAll({
        type: "changeState",
        state: "QUESTION",
        category: category,
        question: question.question,
        answers: question.answers,
        id: id
    })

    setTimeout(() => {
        this.showAnswers();
    }, 25000)
}

Game.prototype.showAnswers = function() {
    let answers = {}

    for (let sessionId in this.sockets) {
        let answer = this.playersAnswered[sessionId]
        let correct = answer == this.currentQuestion.correctAnswer

        // points
        answers[sessionId] = correct
    }

    for (let sessionId in this.sockets) {
        this.sendOne(sessionId, {
            type: "changeState",
            state: "ANSWER",
            correct: answers[sessionId],
            answer: this.currentQuestion.answers[this.currentQuestion.correctAnswer - 1],
            leaderboard: {}
        })
    }

    
    setTimeout(() => {
        this.ask();
    }, 25000)
}

Game.prototype.generateQuestion = function() {
    let categories = Object.keys(Questions)
    let category = categories[Math.floor(Math.random() * categories.length)];
    let questions = Questions[category]
    let question = questions[Math.floor(Math.random() * questions.length)];

    return [category, question]
}

Game.prototype.setAnswer = function(sessionId, answerIndex, id) {
    if (id == this.currentQuestion.id) {
        this.playersAnswered[sessionId] = answerIndex
    }
}

Game.prototype.sendOne = function (sessionID, message) {
    let socket = this.sockets[sessionID]

    if (socket) {
        socket = socket.socket
        socket.send(JSON.stringify(message))
    }
}

Game.prototype.sendAll = function (message) {
    for (let key in this.sockets) {
        let socket = this.sockets[key]
        if (socket) {
            socket = socket.socket
            socket.send(JSON.stringify(message))
        }
    }
}

// Game.prototype.onMessage = function (ws, req, msg) {
//     if (msg == "start") {
//         this.start()
//     }
// }

Game.prototype.onClientJoined = function (ws, req) {
    this.sockets[req.sessionID] = {
        socket: ws,
        request: req
    }
    this.sendAll({
        action: "playerList",
        players: Object.values(this.sockets).map((x) => x.request.session.username)
    })
}

Game.prototype.onClientLeft = function (ws, req) {
    this.sockets[req.sessionID] = null
    this.sendAll({
        action: "playerList",
        players: Object.values(this.sockets).map((x) => x ? x.request.session.username : null)
    })
}

Game.prototype.addMessage = function (author, message) {
    this.messages.push([author, message])
    this.messages = this.messages.slice(-10)
    this.sendAll({
        type: "message",
        from: author,
        content: message
    })
}

Game.prototype.sendPlayerList = function(sessionId) {
    this.sendOne(sessionId, {
        action: "playerList",
        players: Object.values(this.sockets).map((x) => x.request.session.username)
    })
}

module.exports = new GameManager()