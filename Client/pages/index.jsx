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

    async function gotoLogin() {
        router.push(`/login`)
    }

    async function gotoRegister() {
        router.push("/signup")
    }

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
            <button className={styles.loginButton} onClick={gotoLogin}>Log in</button>
            <button className={styles.createAccountButton} onClick={gotoRegister}>Create new account</button>
        </main>

    )
}

export async function getServerSideProps(context) {
    let sessionData = await fetch("http://localhost:8080/api/auth")
    let body = await sessionData.json()
    
    if (body.username != "") {
        return {
            redirect: {
                destination: '/lobby',
                permanent: false
            },
        }
    } else {
        return {
            props: {
      
            },
          }
    }
}