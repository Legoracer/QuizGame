import { useEffect } from "react"

export default function Game(props) {
    useEffect(() => {
        console.log("mounted")
        let ws = new WebSocket(`ws://127.0.0.1:8000/api/ws/${props.data.id}`)
        
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