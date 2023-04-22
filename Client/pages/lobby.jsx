import styles from '../styles/JoinLobby.module.css';
import { Roboto } from '@next/font/google';
import { useEffect, useRef, useState } from 'react';
import { Image } from "next"
import { useRouter } from 'next/router';
const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
});

export default function lobby() {
    let router = useRouter()
    let [username, setUsername] = useState("")
    let [data, setData] = useState({})
    const [promptVisible, setPromptVisible] = useState(false)
    const [lobbyData, setLobbyData] = useState({})

    const updateLobbyData = e => {
        setLobbyData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

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
                    setData(json.data)
                }
            })
        })
    }, [])

    async function joinLobby(e) {
        e.preventDefault()
        const response = await fetch(`/api/game/join/${lobbyData.code}`, {
            method: "PUT",
            credentials: "include"
        })
        const status = response.status

        if (status == 200) {
            router.push(`/game/${lobbyData.code}`)
        }

        setPromptVisible(false)
    }

    async function showPrompt() {
        setPromptVisible(true)
    }

    async function createLobby() {
        const response = await fetch("/api/game/create", {
            method: "POST",
            credentials: "include"
        })
        const json = await response.json()

        if (json.lobby) {
            router.push(`/game/${json.lobby}`)
        }
    }

    async function logout() {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        })
        const status = response.status

        if (status == 200) {
            router.reload()
        }
    }

    return (
        <>
            <style jsx global>{`
        html{
            font-family: ${roboto.style.fontFamily};
        }
        `}</style>

            <main className={styles.mainContainer}>
                <nav className={styles.navbar}>
                    <button onClick={logout} className={styles.logoutButton}>Log out</button>
                </nav>

                <div className={styles.centerContainer}>
                    <h1>{username}</h1>
                    <div className={styles.statisticsContainer}>
                        <div className={styles.totalWinsContainer}>
                            <img className={styles.totalWinsImg} src="/win.png"></img>
                            <p>Total wins: {data.wins || 0}</p>
                        </div>
                        <div className={styles.winRateContainer}>
                            <img className={styles.winRateImg} src="/win-rate.png"></img>
                            <p>Win Rate: {((data.wins / data.total_games) * 100).toFixed(2)}%</p>
                        </div>
                        <div className={styles.correctRateContainer}>
                            <img className={styles.correctRateImg} src="/correct-rate.png"></img>
                            <p>Correct Rate: {((data.correct_answers / data.total_answers) * 100).toFixed(2)}%</p>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button onClick={showPrompt} className={styles.joinLobbyButton}>Join Lobby</button>
                        <button onClick={createLobby} className={styles.createLobbyButton}>Create Lobby </button>
                    </div>
                </div>

                {promptVisible ?
                <div className={styles.popupContainer}>
                    <div className={styles.modal}>
                        <form className={styles.form}>
                            <input value={lobbyData.code} name="code" type='text' placeholder='CODE' onChange={updateLobbyData}/>
                            <button onClick={joinLobby}>JOIN</button>
                        </form>
                    </div>
                </div>
                : null}

            </main>

        </>
    )
}