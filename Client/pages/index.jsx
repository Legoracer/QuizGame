import Head from 'next/head';
import styles from '../styles/Home.module.css';

import {useRouter} from "next/router"

export default function Home() {
    const router = useRouter()

    async function joinLobby() {

    }

    async function createLobby() {
        const response = await fetch("/api/createLobby", {
            method: "POST",
            credentials: "include"
        })
        const json = await response.json()

        if (json.lobby) {
            router.push(`/lobby/${json.lobby}`)
        }
    }

    return (
        <main className={styles.container}>
            <h1>Ghostly Trivia</h1>
            <button className={styles.join} onClick={joinLobby}>Join</button>
            <button className={styles.create} onClick={createLobby}>Create a new lobby</button>
        </main>
    )
}
