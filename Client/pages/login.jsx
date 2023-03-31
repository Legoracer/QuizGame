import styles from '../styles/Home.module.css';
import { Roboto } from '@next/font/google';
import { useRouter } from 'next/router';
import { useState } from 'react';

const roboto = Roboto({ 
    weight: '400',
    subsets: ['latin'],
});

export default function LogIn() {
    const router = useRouter()
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
        let status = response.status

        console.log(status)
        if (status == 200) {
            router.push("/lobby")
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
                <div className={styles.formContainerLogin}>
                    <form className={styles.loginForm} onSubmit={login}>
                        <label className={styles.labelUsername} htmlFor="username">Username:</label>
                        <input onChange={updateData} className={styles.username} type="text" id="username" name="username"/>
    
                        <label className={styles.labelPassword} for="password">Password:</label>
                        <input onChange={updateData} className={styles.password} type="text" id="password" name="password"/>

                        <input className={styles.submitButtonLogin} type="submit" value="Log in"/>
                    </form>
                </div>
            </main>
        </>
    )
}

