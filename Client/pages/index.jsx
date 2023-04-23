import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Bowlby_One_SC } from '@next/font/google';

import { useRouter } from "next/router"
import { useEffect } from 'react';

const titleFont = Bowlby_One_SC({
    weight: '400',
    subsets: ['latin']
});


export default function Home() {
    const router = useRouter()

    useEffect(() => {
        let sessionData = fetch("http://localhost:8080/api/auth", {
            credentials: "include",
            headers: { 'Content-Type': 'application/json' }
        }).then((sessionData) => {
            sessionData.json().then((json) => {
                if (json.username != null && json.username != "") {
                    router.push("/lobby")
                }
            })
        })        
    })

    async function gotoLogin() {
        router.push(`/login`)
    }

    async function gotoRegister() {
        router.push("/signup")
    }

    return (
        <main className={styles.mainContainer}>
            <h1 className={[titleFont.className, styles.mainTitle].join(" ")}>Trivia Pursuit</h1>
            <button className={styles.loginButton} onClick={gotoLogin}>Log in</button>
            <button className={styles.createAccountButton} onClick={gotoRegister}>Create new account</button>
        </main>

    )
}