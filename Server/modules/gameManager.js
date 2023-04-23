const EventEmitter = require("events")
const Questions = require("../modules/questions.json")
const uuid = require('uuid');
const redis = require("../modules/redisConnection");
const redisConnection = require("../modules/redisConnection");

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
    this.finished = false
    this.questionCount = 0
    
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

    for (let sessionId in this.sockets) {
        let val = this.sockets[sessionId]
        if (val.request && val.request.session && val.request.session.username) {
            let username = val.request.session.username;
            redisConnection.hincrby(`user:${username}`, "total_games", 1) 
        }
    }
}

Game.prototype.ask = function() {
    let [category, question] = this.generateQuestion()
    let id = uuid.v4()

    if (this.finished) return

    this.questionCount++;
    this.currentQuestion = {
        answers: question.answers,
        correctAnswer: question.correctAnswer,
        id: id
    }
    this.playersAnswered = {}
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
    }, 10000)
}

Game.prototype.showAnswers = async function() {
    let answers = {}
    
    for (let sessionId in this.sockets) {
        let val = this.sockets[sessionId]
        let answer = this.playersAnswered[sessionId]
        let correct = answer == this.currentQuestion.correctAnswer

        
        if (val.request && val.request.session && val.request.session.username) {
            let username = val.request.session.username
            redisConnection.zadd(`game:${this.id}:points`, 'incr', [correct ? 100 : 0, username])
            redisConnection.hincrby(`user:${username}`, "total_answers", 1)
            if (correct) {
                redisConnection.hincrby(`user:${username}`, "correct_answers", 1) 
            }
        }
        
        // points
        answers[sessionId] = correct
    }

    let lb = await redisConnection.zrange(`game:${this.id}:points`, 0, -1, 'rev', 'withscores')
    let lb_formatted = {}

    for (let i=0; i<lb.length; i+=2) {
        let k = lb[i];
        let v = lb[i+1]

        lb_formatted[k] = v
    }

    for (let sessionId in this.sockets) {
        this.sendOne(sessionId, {
            type: "changeState",
            state: "ANSWER",
            correct: answers[sessionId],
            answer: this.currentQuestion.answers[this.currentQuestion.correctAnswer - 1],
            leaderboard: lb_formatted
        })
    }

    if (this.questionCount == 10) {
        setTimeout(() => {
            this.finish();
        }, 5000)
    } else {
        setTimeout(() => {
            this.ask();
        }, 5000)
    }
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

Game.prototype.finish = async function() {
    this.finished = true

    let lb = await redisConnection.zrange(`game:${this.id}:points`, 0, -1, 'rev', 'withscores')

    let first = lb[0]
    let second = lb[2]
    let third = lb[4]

    redisConnection.hincrby(`user:${first}`, "wins", 1) 

    this.sendAll({
        type: "changeState",
        state: "END",
        first: first,
        second: second ? second : "Nobody",
        third: third ? third : "Nobody"
    })
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
    if (!this.sockets[req.sessionID]) {
        this.sockets[req.sessionID] = {
            socket: ws,
            request: req
        }
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