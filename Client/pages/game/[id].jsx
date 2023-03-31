import { useEffect } from "react"
import { io } from "socket.io-client"
import styles from '../../styles/Lobby.module.css';

export default function Game(props) {
    useEffect(() => {
        console.log("mounted")

        const socket = io(`ws://localhost:8080/api/ws/${props.data.id}`, {
            reconnectionDelayMax: 10000,
            auth: {
                token: "123"
            },
        });


        return () => {
            console.log("unmounted")
        }
    })

    return (
        <main>

        </main>
    )
}

export async function getStaticPaths() {
    // Return a list of possible value for id
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog post using params.id
    console.log(params.id) // good
    let response = await fetch(`http://localhost:8080/api/game/${params.id}`, {
        method: "GET"
    })
    let json = await response.json();

    if (json.state == null) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
        }
    }

    return {
        props: json || {}
    }
}