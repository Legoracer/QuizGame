import styles from '../styles/Home.module.css';
import { Roboto } from '@next/font/google';

const roboto = Roboto({ 
    weight: '400',
    subsets: ['latin'],
});

export default function LogIn() {
    
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
                        <label className={styles.labelUsername} for="username">Username:</label>
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

