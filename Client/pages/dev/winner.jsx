import styles from '../../styles/Lobby.module.css';
import celebration from '../../styles/Celebration.module.css';
import { Roboto } from '@next/font/google'

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
})

export default function winner() {
    return (

        <>
            <div className={[roboto.className, styles.winner].join(" ")}>
            <div className={celebration.confettis}>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                    <div className={celebration.confetti}></div>
                </div>
                <div className={styles.winnerDiv}>
                    <div className={styles.winnerImages}>
                        <div className={styles.second}>
                            <img src="/silver-medal.svg"></img>
                            <h2>2nd: Max</h2>
                        </div>
                        <div className={styles.first}>
                            <img src="/trophy.svg"></img>
                            <h1>1st: Bkadishdiwudh989</h1>
                        </div>
                        <div className={styles.third}>
                            <img src="/bronze-medal.svg"></img>
                            <h2>3rd: Tena</h2>
                        </div>
                    </div>
                    <button>Go back</button>
                </div>
            </div>
        </>
    )
}