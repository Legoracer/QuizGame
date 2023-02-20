import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {

    return (
        <main className={styles.container}>
            <h1>Ghostly Trivia</h1>
            <button className={styles.join}>Join</button>
            <button className={styles.create}>Create a new lobby</button>
        </main>
    )
}
