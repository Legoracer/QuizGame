import styles from '../../styles/Lobby.module.css';
import { Roboto } from '@next/font/google'

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
  })

export default function answer() {

    return (
        <div className={[roboto.className, styles.answer].join(" ")}>
            <h1>You answered correctly!</h1>
            <h3>Answer: Reykjavik</h3>
            <h2>LEADERBOARD</h2>
            <div className={styles.leaderboard}>
                <p>Sara</p>
                <p>Max</p>
                <p>Tena</p>
                <p>Vilim</p>
            </div>
        </div>
        
    )
}