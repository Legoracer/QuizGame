import styles from '../styles/JoinLobby.module.css';
import { Roboto } from '@next/font/google';
import { useState } from 'react';

const roboto = Roboto({ 
    weight: '400',
    subsets: ['latin'],
});

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