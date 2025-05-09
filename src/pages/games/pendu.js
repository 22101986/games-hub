import Head from 'next/head';
import Link from 'next/link';
import PenduGame from '../../components/games/Pendu/Game';
import styles from '../../styles/Games.module.css';

export default function PenduPage() {
  return (
    <div className={styles.gameContainer}>
      <Head>
        <title>Pendu NEXT| Hub de Jeux</title>
      </Head>
      
      <Link href="/" className={styles.backButton}>
        ← Retour au hub
      </Link>
      
      <PenduGame />
    </div>
  );
}