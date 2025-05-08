import Link from 'next/link';
import styles from '../styles/Games.module.css';

export default function Home() {
  return (
    <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <div className={styles.hubContainer}>
        <h1 className={styles.title}>MyGamesHub</h1>
        <div className={styles.gamesGrid}>
            <GameCard 
              title="Morpion" 
              description="Le classique jeu de X et O"
              href="/games/morpion"
              bgColor="#265520"
              emoji="❌🟢"
            />
            <GameCard 
              title="Sudoku" 
              description="Puzzle de chiffres japonais"
              href="/games/sudoku"
              bgColor="#f6d365"
              emoji="🔢"
            />
            <GameCard 
              title="Mots Mêlés" 
              description="Trouvez les mots cachés"
              href="/games/mots-meles"
              bgColor="#6a67ce"
              emoji="🔍"
            />
            <GameCard 
              title="2048" 
              description="Fusionnez les tuiles pour gagner"
              href="/games/2048"
              bgColor="#ff6f61"
              emoji="🧩"
            />
            <GameCard 
              title="Memory South Park" 
              description="Jeu de mémoire avec les personnages"
              href="/games/memory-south-park"
              bgColor="#44ff44"
              emoji="🧠"
            />
            <GameCard 
              title="Pierre Feuille Ciseaux" 
              description="Le jeu classique de stratégie"
              href="/games/pierre-feuille-ciseaux"
              bgColor="#5d9cec"
              emoji="✊ ✋ ✌️"
            />
            <GameCard 
              title="Snake" 
              description="Contrôlez le serpent et mangez sans vous mordre"
              href="/games/snake"
              bgColor="#1abc9c"
              emoji="🐍"
            />
        </div>
        </div>
    </div>
  );
}

function GameCard({ title, description, href, bgColor, emoji }) {
  return (
    <Link href={href} passHref>
      <div className={styles.gameCard} style={{ backgroundColor: bgColor }}>
        <div className={styles.cardContent}>
          <span className={styles.emoji}>{emoji}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
}