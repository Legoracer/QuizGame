import styles from '../styles/Home.module.css';
import { Roboto } from '@next/font/google';
import { useState } from 'react';

const roboto = Roboto({ 
    weight: '400',
    subsets: ['latin'],
});

export default function LogIn() {
    const [data, setData] = useState({})

    const updateData = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    async function login(event) {
        event.preventDefault()
        
        const response = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                username: data.username,
                password: data.password
            }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        // const json = await response.json()
    }

    return (
        <>
            <style jsx global>{`
            html{
                font-family: ${roboto.style.fontFamily};
            }
            `}</style>

            <main className={styles.mainContainer}>
                <div className={styles.formContainerLogin}>
                    <form className={styles.loginForm}>
                        <label className={styles.labelUsername} htmlFor="username">Username:</label>
                        <input className={styles.username} type="text" id="username" name="username"/>
    
                        <label className={styles.labelPassword} for="password">Password:</label>
                        <input className={styles.password} type="text" id="password" name="password"/>

                        <input className={styles.submitButtonLogin} type="submit" value="Log in"/>
                    </form>
                </div>
            </main>
        </>
    )
}

