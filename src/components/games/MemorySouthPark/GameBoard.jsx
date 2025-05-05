import { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import styles from './MemorySouthPark.module.css';

const GameBoard = ({ level, onReset }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const gifLibrary = {
    easy: [
      '/gifs/south-park-1.gif',
      '/gifs/south-park-2.gif',
      '/gifs/south-park-3.gif',
      '/gifs/south-park-4.gif',
      '/gifs/south-park-5.gif',
      '/gifs/south-park-6.gif'
    ],
    medium: [
      '/gifs/south-park-7.gif',
      '/gifs/south-park-8.gif',
      '/gifs/south-park-9.gif',
      '/gifs/south-park-10.gif'
    ]
  };

  const getGifsForLevel = useCallback(() => {
    let gifs = [...gifLibrary.easy];
    if (level.pairs > 6) gifs = [...gifs, ...gifLibrary.medium];
    return [...gifs].sort(() => Math.random() - 0.5).slice(0, level.pairs);
  }, [level]);

  const initializeGame = useCallback(() => {
    const selectedGifs = getGifsForLevel();
    const cardPairs = selectedGifs.flatMap((gif, index) => [
      { id: `${index}-a`, content: gif, matched: false },
      { id: `${index}-b`, content: gif, matched: false }
    ]);

    setCards([...cardPairs].sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  }, [getGifsForLevel]);

  useEffect(() => initializeGame(), [initializeGame]);

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id) || gameWon) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.content === secondCard.content) {
        setMatched([...matched, firstId, secondId]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) setGameWon(true);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className={styles.gameBoard}>
      <div className={styles.gameHeader}>
        <button onClick={onReset} className={styles.btnDanger}>
          Retour au menu
        </button>
        <div className={styles.police}>Mouvements: {moves}</div>
      </div>

      {gameWon && (
        <div className={styles.alertSuccess}>
          <h3 className={styles.police}>BRAVO! Vous avez gagné en {moves} coups!</h3>
          <button onClick={initializeGame} className={styles.btnPrimary}>
            Rejouer
          </button>
        </div>
      )}

      <div 
        className={styles.cardsGrid}
        style={{ 
          gridTemplateColumns: `repeat(${level.cols}, 1fr)`,
          maxWidth: `${level.cols * 120}px`
        }}
      >
        {cards.map(card => (
          <Card
            key={card.id}
            id={card.id}
            content={card.content}
            isFlipped={flipped.includes(card.id) || matched.includes(card.id)}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;