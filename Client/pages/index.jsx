import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Bowlby_One_SC } from '@next/font/google';

import {useRouter} from "next/router"

const titleFont = Bowlby_One_SC ({
    weight:'400',
    subsets: ['latin']
});


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
        <main className={styles.mainContainer}>
            <h1 className={[titleFont.className, styles.mainTitle].join(" ")}>Ghostly Trivia</h1> 
            <button className={styles.loginButton} onClick={joinLobby}>Log in</button>
            <button className={styles.createAccountButton} onClick={createLobby}>Create new account</button>
        </main>

    )
}
