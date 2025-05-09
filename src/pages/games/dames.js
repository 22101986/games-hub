import Head from 'next/head';
import Link from 'next/link';
import CheckersGame from '../../components/games/Dames/Game';
import styles from '../../styles/Games.module.css';

export default function Game2048Page() {
  return (
    <div className={styles.gameContainer}>
      <Head>
        <title>Dames | Hub de Jeux</title>
      </Head>
      
      <Link href="/" className={styles.backButton}>
        ← Retour au hub
      </Link>
      
      <CheckersGame />
    </div>
  );
}