import styles from '../styles/Home.module.css';
import { Roboto } from '@next/font/google';

const roboto = Roboto({ 
    weight: '400',
    subsets: ['latin'],
});

export default function SignUp() {
    
    return (
        <>
            <style jsx global>{`
            html{
                font-family: ${roboto.style.fontFamily};
            }
            `}</style>

            <main className={styles.mainContainer}>
                <div className={styles.formContainerSignup}>
                    <form className={styles.loginForm}>
                        <label className={styles.labelUsername} for="username">Username:</label>
                        <input className={styles.username} type="text" id="username" name="username"/>

                        <label className={styles.labelEmail} for="email">Email:</label>
                        <input className={styles.email} type="text" id="email" name="email"/> 
                        
                        <label className={styles.labelPassword} for="password">Password:</label>
                        <input className={styles.password} type="text" id="password" name="password"/>

                        <input className={styles.submitButtonSignup} type="submit" value="Sign up"/>
                    </form>
                </div>
            </main>
        </>
    )
}