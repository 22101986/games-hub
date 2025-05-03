import Head from 'next/head';
import Link from 'next/link';
import MotsMelesGame from '../../components/games/Sudoku/Game';
import styles from '../../styles/Games.module.css';

export default function SudokuPage() {
  return (
    <div className={styles.gameContainer}>
      <Head>
        <title>Sudoku | Hub de Jeux</title>
      </Head>
      
      <Link href="/" className={styles.backButton}>
        ← Retour au hub
      </Link>
      
      <MotsMelesGame />
    </div>
  );
}