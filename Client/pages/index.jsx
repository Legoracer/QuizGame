import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {

  async function joinLobby() {
    console.log("joining lobby...")
  }

  async function createLobby() {
    const response = await fetch("/api/createLobby", {
      method: "POST"
    })

    console.log(response)
  }

  return (
    <main className={styles.container}>
      <h1>Spooky Quiz</h1>
      
      <div>
        <button className={styles.primary} onClick={joinLobby} >Join a lobby</button>
        <button className={styles.secondary} onClick={createLobby}>Create a lobby</button>
      </div>
    </main>
  )
}
