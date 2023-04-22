import { useEffect, useMemo, useRef, useState } from "react"
import { io } from "socket.io-client"
import Chat from "../../components/chat"
import { useRouter } from 'next/router';
import styles from '../../styles/Lobby.module.css';

export default function Game(props) {
    let router = useRouter()
    let [username, setUsername] = useState({})
    let [messages, setMessages] = useState([])
    let [players, setPlayers] = useState([])
    let [state, setState] = useState("LOBBY")
    let questionData = useRef({
        question: null,
        answers: null
    })
    let answerData = useRef({

    })

    const isBrowser = typeof window !== "undefined";
    const socket = useMemo(() => isBrowser ? new WebSocket(`ws://localhost:8080/api/ws/${props.data.id}`) : null, []);

    useEffect(() => {
        let sessionData = fetch("http://localhost:8080/api/auth", {
            credentials: "include",
            headers: { 'Content-Type': 'application/json' }
        }).then((sessionData) => {
            sessionData.json().then((json) => {
                if (json.username == null || json.username == "") {
                    router.push("/")
                } else {
                    setUsername(json.username)
                }
            })
        })
    })

    useEffect(() => {

        function addMessage(author, message) {
            let x = messages.concat([[author, message]])
            x = x.slice(-10)
            setMessages(x)
        }

        socket.addEventListener("message", (e) => {
            let msg = e.data
            let data = JSON.parse(msg)
            if (data.type == "message") {
                addMessage(data.from, data.content)
            } else if (data.type == "messageHistory") {
                for (let message of data.messages) {
                    setMessages(data.messages)
                }
            } else if (data.type == "playerList") {
                setPlayers(data.players)
            } else if (data.type == "changeState") {
                console.log(data)
                if (data.state == "QUESTION") {
                    questionData.current = {
                        category: data.category,
                        question: data.question,
                        answers: data.answers,
                        id: data.id
                    }
                    setState(data.state)
                } else if (data.state == "ANSWER") {
                    answerData.current = {
                        correct: data.correct,
                        answer: data.answer,
                        leaderboard: data.leaderboard
                    }
                    setState(data.state)
                }
            }
        });
        
        return () => {
            
        }
    })


    function answer(i) {
        socket.send(JSON.stringify({
            type: "answer",
            answer: i,
            id: questionData.current.id
        }))
    }
    

    return (
        <div className={styles.main}>
            {/* DO NOT TOUCH ANYTHING BELOW THIS! */}
            {(state == "LOBBY") ?
            <Lobby messages={messages} socket={socket} username={username} props={props}/>
            : null}

            {(state == "QUESTION") ?
            <Question questionData={questionData.current} submitAnswer={answer}/>
            : null}

            {(state == "ANSWER") ?
            <Answer isCorrect={answerData.current.correct} correctString={answerData.current.answer} leaderboard={answerData.current.leaderboard}/>
            : null}
            {/* UP TO HERE! */}
        </div>
    )
}

function Lobby({socket, messages, username, props}) {
    function sendMessage(message) {
        if (socket) {
            if (message != "") {
                socket.send(JSON.stringify({
                    type: "message",
                    content: message
                }))
            }
        }
    }

    function startGame() {
        socket.send(JSON.stringify({
            type: "start"
        }))
    }

    return (
        <>
            <Chat messages={messages} sendMessage={sendMessage} />
            <main className={styles.wait}>
                <h1>{props.data.id}</h1>
                <p>You are: {props.data.host == username ? "HOST" : "PLAYER"}</p>
                <p>Players in lobby: </p>

                {props.data.host == username ?
                <button onClick={startGame}>START</button>
                :null}
            </main>
        </>
    )
}


function Question({questionData, submitAnswer}) {
    let [answer, setAnswer] = useState(-1)

    function submit(e) {
        let i = e.target.value
        setAnswer(i)
        submitAnswer(i)
    }

    return (
        <div className={styles.question}>
            <h2>{questionData.question}</h2>
            <h4>{questionData.category}</h4>
            <div className={styles.answers}>
                <button value={1} disabled={answer!=-1} onClick={submit}>{questionData.answers[0]}</button>
                <button value={2} disabled={answer!=-1} onClick={submit}>{questionData.answers[1]}</button>
                <button value={3} disabled={answer!=-1} onClick={submit}>{questionData.answers[2]}</button>
                <button value={4} disabled={answer!=-1} onClick={submit}>{questionData.answers[3]}</button>
            </div>
        </div>
    )
}


function Answer({isCorrect, correctString, leaderboard}) {
    let [answer, setAnswer] = useState(-1)

    function submit(e) {
        let i = e.target.value
        setAnswer(i)
        submitAnswer(i)
    }

    return (
        <div className={styles.answer}>
            <h2>You answered {isCorrect ? "Correctly" : "Incorrectly"}</h2>
            <p>{correctString}</p>
            <div>

            </div>
        </div>
    )
}

export async function getStaticPaths() {
    // Return a list of possible value for id
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog post using params.id
    let response = await fetch(`http://localhost:8080/api/game/${params.id}`, {
        method: "GET"
    })
    let json = await response.json();

    if (json.state == null) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
        }
    }
    
    return {
        props: json || {}
    }
}

