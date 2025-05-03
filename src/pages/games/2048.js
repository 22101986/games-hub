import Head from 'next/head';
import Link from 'next/link';
import Game2048 from '../../components/games/Game2048/Game';
import styles from '../../styles/Games.module.css';

export default function Game2048Page() {
  return (
    <div className={styles.gameContainer}>
      <Head>
        <title>2048 | Hub de Jeux</title>
      </Head>
      
      <Link href="/" className={styles.backButton}>
        ← Retour au hub
      </Link>
      
      <Game2048 />
    </div>
  );
}