import styles from '../../styles/Lobby.module.css';

function Example({string}) {
    let sx = "1E2C8A"
    return (
        <div className={styles.a}>
            {
                Object.values([...sx]).map(v => (
                    <h1>{v}</h1>
                ))
            }
        </div>
    )
}


export default Example