import styles from '../styles/LobbyId.module.css';
import { Roboto } from '@next/font/google';

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
  })

function Example({lobby}) {
    return (
        <div className={[roboto.className, styles.lobbyID].join(" ")}>
            {
                Object.values([...lobby]).map(v => (
                    <h1>{v}</h1>
                ))
            }
        </div>
    )
}


export default Example