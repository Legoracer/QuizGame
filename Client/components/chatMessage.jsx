import styles from '../styles/Chat.module.css';

export default function chatMessage({username, message}) {
    return (
        <div className={styles.chatMessage}>
            <p className={styles.author}>[{username}]:</p>
            <p className={styles.content}>{message}</p>
        </div>
    )
}