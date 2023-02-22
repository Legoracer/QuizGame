import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Bowlby_One_SC } from '@next/font/google';

import {useRouter} from "next/router"

// const titleFont = Bowlby_One_SC ({
//     weight:'400',
//     subsets: ['latin']
// });


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
            <div className={styles.titleContainer}>
                {/* <h1 className={titleFont.className}>Ghostly Trivia</h1>  */}
                <h1>Ghostly Trivia</h1>
            </div>
            <button className={styles.join} onClick={joinLobby}>JOIN</button>
            <button className={styles.create} onClick={createLobby}>Create a new lobby</button>
        </main>

    )
}
