import styles from '../../styles/Lobby.module.css';
import { Roboto } from '@next/font/google'

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
  })

export default function question() {

    return (
        <div className={[roboto.className, styles.question].join(" ")}>
            <h1>Which is the most northernly capital city in Europe?</h1>
            <h3>Geography</h3>
            <div className={styles.answers}>
                <button>Oslo</button>
                <button>Stockholm</button>
                <button>Helsinki</button>
                <button>Reykjavik</button>
            </div>
        </div>
    )
}