import Head from 'next/head';
import Link from 'next/link';
import MemorySouthPark from '../../components/games/MemorySouthPark/Game';
import styles from '../../styles/Games.module.css';

export default function MemorySouthParkPage() {
  return (
    <div className={styles.gameContainer}>
    <Head>
      <title>SouthParkMememory | Hub de Jeux</title>
    </Head>
    
    <Link href="/" className={styles.backButton}>
      ← Retour au hub
    </Link>
    
    <MemorySouthPark />
  </div>
  );
}