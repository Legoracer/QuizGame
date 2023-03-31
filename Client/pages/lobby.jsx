import styles from '../styles/JoinLobby.module.css';
import { Roboto } from '@next/font/google';
import { useEffect, useState } from 'react';
import {Image} from "next"
import { useRouter } from 'next/router';
const roboto = Roboto({ 
    weight: '400',
    subsets: ['latin'],
});

export default function lobby() {
    let router = useRouter()

    useEffect(() => {
        let sessionData = fetch("http://localhost:8080/api/auth", {
            credentials: "include",
            headers: { 'Content-Type': 'application/json' }
        }).then((sessionData) => {
            sessionData.json().then((json) => {
                if (json.username == null || json.username =="") {
                    router.push("/")
                }
            })
        })        
    })

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
            <div className={styles.statisticsContainer}>
                <div className={styles.totalWinsContainer}>
                    <img className={styles.totalWinsImg} src="/win.png"></img>
                    <p>Total wins: 75</p>
                </div>
                <div className={styles.winRateContainer}>
                    <img className={styles.winRateImg} src="/win-rate.png"></img> 
                    <p>Correct Rate: 50.00%</p>
                </div>
                <div className={styles.correctRateContainer}>
                    <img className={styles.correctRateImg} src="/correct-rate.png"></img>
                    <p>Correct Rate: 70.00%</p>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.joinLobbyButton}>Join Lobby</button>
                <button className={styles.createLobbyButton}>Create Lobby </button>
            </div>
        </div>
        </main>

        </>
    )

}