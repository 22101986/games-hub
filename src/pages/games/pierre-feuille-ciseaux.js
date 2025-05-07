import Head from 'next/head';
import Link from 'next/link';
import PierreFeuilleCiseaux from '../../components/games/PierreFeuilleCiseaux/Game';
import styles from '../../styles/Games.module.css';

export default function PierreFeuilleCiseauxPage() {
  return (
    <div className={styles.gameContainer}>
      <Head>
        <title>Pierre Feuille Ciseaux | Hub de Jeux</title>
      </Head>
      
      <Link href="/" className={styles.backButton}>
        ← Retour au hub
      </Link>
      
      <PierreFeuilleCiseaux />
    </div>
  );
}