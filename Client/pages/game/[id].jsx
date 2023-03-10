import { useEffect } from "react"
import { io } from "socket.io-client"

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
        <><h1>
            {props.data.id}
        </h1><h2>
                {props.data.host}
            </h2></>
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

    return {
        props: json || {}
    }
}