import styles from '../styles/Home.module.css';
import { Roboto } from '@next/font/google';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const roboto = Roboto({ 
    weight: '400',
    subsets: ['latin'],
});

export default function SignUp() {
    const router = useRouter()
    const [data, setData] = useState({})

    const updateData = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        let sessionData = fetch("http://localhost:8080/api/auth", {
            credentials: "include",
            headers: { 'Content-Type': 'application/json' }
        }).then((sessionData) => {
            sessionData.json().then((json) => {
                if (json.username != null && json.username != "") {
                    router.push("/lobby")
                }
            })
        })        
    })

    async function signup(event) {
        event.preventDefault()

        const response = await fetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify({
                username: data.username,
                password: data.password,
                email: data.email
            }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
       
        if (response.status == 200) {
            router.push(`/`)
        } else {
            router.reload()
        }
    }
    
    return (
        <>
            <style jsx global>{`
            html{
                font-family: ${roboto.style.fontFamily};
            }
            `}</style>

            <main className={styles.mainContainer}>
                <div className={styles.formContainerSignup}>
                    <form onSubmit={signup} className={styles.loginForm}>
                        <label className={styles.labelUsername} htmlFor="username">Username:</label>
                        <input onChange={updateData} className={styles.username} type="text" id="username" name="username"/>

                        <label className={styles.labelEmail} htmlFor="email">Email:</label>
                        <input onChange={updateData} className={styles.email} type="text" id="email" name="email"/> 
                        
                        <label className={styles.labelPassword} htmlFor="password">Password:</label>
                        <input onChange={updateData} className={styles.password} type="text" id="password" name="password"/>

                        <input className={styles.submitButtonSignup} type="submit" value="Sign up"/>
                    </form>
                </div>
            </main>
        </>
    )
}