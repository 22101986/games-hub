import React, { useState, useEffect } from 'react';
import Header from './Header';
import LevelSelector from './LevelSelector';
import GameBoard from './GameBoard';
import WelcomeModal from './WelcomeModal';
import styles from './MemorySouthPark.module.css';

function MemorySouthParkGame() {
  const [level, setLevel] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const startGame = (selectedLevel) => {
    setLevel(selectedLevel);
    setGameStarted(true);
    setShowWelcome(false);
  };

  const resetGame = () => {
    setLevel(null);
    setGameStarted(false);
  };

  useEffect(() => {
    const informed = sessionStorage.getItem('informed');
    if (informed) {
      setShowWelcome(false);
    }
  }, []);

  return (
    <div className={styles.app}>
      <Header resetGame={resetGame} />
      
      <main className={styles.container}>
        {showWelcome && (
          <WelcomeModal 
            onClose={() => {
              setShowWelcome(false);
              sessionStorage.setItem('informed', true);
            }} 
          />
        )}
        
        {!gameStarted ? (
          <LevelSelector onSelectLevel={startGame} />
        ) : (
          <GameBoard level={level} onReset={resetGame} />
        )}
      </main>
    </div>
  );
}

export default MemorySouthParkGame;