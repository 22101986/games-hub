import Head from 'next/head';
import Link from 'next/link';
import SnakeGame from '../../components/games/Snake/Game';
import styles from '../../styles/Games.module.css';

export default function SnakePage() {
  return (
    <div className={styles.gameContainer}>
      <Head>
        <title>Snake | Hub de Jeux</title>
      </Head>
      
      <Link href="/" className={styles.backButton}>
        ← Retour au hub
      </Link>
      
      <SnakeGame />
    </div>
  );
}