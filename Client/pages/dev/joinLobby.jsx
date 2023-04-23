import styles from '../../styles/Lobby.module.css';
import { Roboto } from '@next/font/google';
import LobbyId from "../../components/lobbyId";

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
  })

export default function joinLobby() {

    return (
        // <Chat messages={messages} sendMessage={sendMessage} />
        <main className={[roboto.className, styles.wait].join(" ")}>
            <div className={styles.waitTitleContainer}>
                <LobbyId lobby="A3GV40"/>
            </div>
            <div className={styles.waitContainer}>
                <p>You are: HOST</p>
                <p>Players in lobby: 4 </p>
                <button>START</button>
            </div>
        </main>
    )
}