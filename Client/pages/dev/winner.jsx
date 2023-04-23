import styles from '../../styles/Lobby.module.css';
import { Roboto } from '@next/font/google'

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
  })

export default function winner() {
    return (
        <div className={[roboto.className, styles.winner].join(" ")}>
            <img src="/crown.svg"></img>
            <h1>You are the winner!</h1>
        </div>
    )
}