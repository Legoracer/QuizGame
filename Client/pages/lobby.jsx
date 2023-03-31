import styles from '../styles/JoinLobby.module.css';
import { Roboto } from '@next/font/google';
import { useState } from 'react';
import {Image} from "next"
const roboto = Roboto({ 
    weight: '400',
    subsets: ['latin'],
});

export default function lobby() {

    return (
        <>
            <style jsx global>{`
        html{
            font-family: ${roboto.style.fontFamily};
        }
        `}</style>

        <main className={styles.mainContainer}>
        <nav className={styles.navbar}>
            <button className={styles.logoutButton}>Log out</button>
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

export async function getServerSideProps(context) {
    let sessionData = await fetch("http://localhost:8080/api/auth")
    let body = await sessionData.json()
    
    if (body.username == "") {
        return {
            redirect: {
                destination: '/',
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