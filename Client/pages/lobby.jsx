import styles from '../styles/JoinLobby.module.css';
import { Roboto } from '@next/font/google';
import { useState } from 'react';

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
});

export default function lobby() {

    return (
        <>
            <style jsx global>{`
        html{
            font-family: ${roboto.style.fontFamily};
        }
        `}</style>

            <main className={styles.mainContainer}>

            </main>

        </>
    )

}

export async function getServerSideProps(context) {
    let sessionData = await fetch("http://localhost:8080/api/auth")
    let body = await sessionData.json()
    
    if (body.username == "") {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
        }
    } else {
        return {
            props: {
      
            },
          }
    }
  }