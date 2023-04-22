import { useState } from "react"
import ChatMessage from "./chatMessage"
import styles from "../styles/Chat.module.css"

export default function chat({ messages, sendMessage }) {
    const [data, setData] = useState({})

    const updateData = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    function _sendMessage(e) {
        e.preventDefault()
        sendMessage(data.message)
        data.message = ""
    }
    return (
        <div className={styles.chat}>
            <div>
                {(() => {
                    let td = []
                    for (let msg of messages) {
                        td.push(<ChatMessage username={msg[0]} message={msg[1]} />)
                    }
                    return td
                })()}
            </div>
            <form onSubmit={_sendMessage}>
                <input value={data.message} name="message" type="text" placeholder="Click here or press '/' to chat" onChange={updateData}/>
            </form>
        </div>
    )
}